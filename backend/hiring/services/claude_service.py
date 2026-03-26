import json
import base64
import logging
from pathlib import Path

import anthropic

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).resolve().parent.parent / 'prompts'

client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY from env


def _load_prompt(name: str) -> str:
    return (PROMPTS_DIR / name).read_text()


def _parse_json_response(text: str) -> dict:
    """Extract JSON from Claude's response, handling markdown code blocks."""
    text = text.strip()
    if text.startswith('```'):
        # Remove markdown code fences
        lines = text.split('\n')
        lines = [l for l in lines if not l.strip().startswith('```')]
        text = '\n'.join(lines).strip()
    return json.loads(text)


def screen_resume(pdf_bytes: bytes, job_description: str) -> dict:
    """Send resume PDF to Claude for screening and scoring."""
    prompt = _load_prompt('resume_screening.txt')

    pdf_b64 = base64.standard_b64encode(pdf_bytes).decode('utf-8')

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": f"{prompt}\n\nJob Description:\n{job_description}",
                    },
                ],
            }
        ],
    )

    text = response.content[0].text
    result = _parse_json_response(text)

    logger.info("Resume screened: score=%s, recommendation=%s", result.get('score'), result.get('recommendation'))
    return result


def analyze_transcript(transcript: str, job_description: str = "") -> dict:
    """Analyze an interview transcript and return scores."""
    prompt = _load_prompt('transcript_analysis.txt')

    context = f"{prompt}\n\nTranscript:\n{transcript}"
    if job_description:
        context += f"\n\nJob Description:\n{job_description}"

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[
            {"role": "user", "content": context},
        ],
    )

    text = response.content[0].text
    result = _parse_json_response(text)

    logger.info("Transcript analyzed: score=%s, recommendation=%s", result.get('score'), result.get('recommendation'))
    return result


def get_interview_system_prompt(candidate_name: str, key_skill: str = "your primary technical skill") -> str:
    """Get the system prompt for the Vapi voice interview assistant."""
    prompt = _load_prompt('interview_system.txt')
    prompt = prompt.replace('{key_skill}', key_skill)
    prompt += f"\n\nCandidate name: {candidate_name}"
    return prompt
