"""Agentic interviewer loop — handles Vapi custom LLM requests using Claude."""
import json
import logging
import anthropic

from .claude_service import get_interview_system_prompt

logger = logging.getLogger(__name__)

client = anthropic.Anthropic()

TOOLS = [
    {
        "name": "end_call",
        "description": "End the phone call. Use this after saying goodbye and wrapping up the interview.",
        "input_schema": {
            "type": "object",
            "properties": {
                "reason": {
                    "type": "string",
                    "description": "Why the call is ending (e.g., 'interview_complete', 'candidate_unavailable')",
                }
            },
            "required": ["reason"],
        },
    },
]


def openai_messages_to_claude(messages: list) -> list:
    """Convert OpenAI-format messages (from Vapi) to Claude-format messages."""
    claude_messages = []
    for msg in messages:
        role = msg.get("role", "")
        content = msg.get("content", "")
        if role == "system":
            continue
        if role == "assistant":
            claude_messages.append({"role": "assistant", "content": content or ""})
        elif role in ("user", "human"):
            claude_messages.append({"role": "user", "content": content or ""})
    return claude_messages


def handle_conversation_turn(
    conversation_history: list,
    candidate_name: str = "Candidate",
    key_skill: str = "your primary technical skill",
) -> dict:
    """Run the Claude agentic loop for the interview.
    Returns {"text": str, "end_call": bool}."""
    system_prompt = get_interview_system_prompt(candidate_name, key_skill)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=system_prompt,
        tools=TOOLS,
        messages=conversation_history,
    )

    should_end_call = False

    while response.stop_reason == "tool_use":
        tool_block = next(
            (b for b in response.content if b.type == "tool_use"), None
        )
        if not tool_block:
            break

        if tool_block.name == "end_call":
            logger.info("Interview end_call: reason=%s", tool_block.input.get("reason", "unknown"))
            should_end_call = True
            break

        # No other tools for now — just break if unknown
        logger.warning("Unknown tool called: %s", tool_block.name)
        break

    text_block = next((b for b in response.content if b.type == "text"), None)
    response_text = text_block.text.strip() if text_block else ""

    if not response_text:
        if should_end_call:
            response_text = "Thank you so much for your time today. We'll review everything and get back to you soon. Have a great day!"
        else:
            response_text = "Is there anything else you'd like to share before we wrap up?"

    return {
        "text": response_text,
        "end_call": should_end_call,
    }
