import os
import logging

import requests

from .claude_service import get_interview_system_prompt

logger = logging.getLogger(__name__)

VAPI_API_URL = "https://api.vapi.ai"
VAPI_ASSISTANT_ID = os.getenv("VAPI_ASSISTANT_ID", "6f4b87fd-8d25-4743-8a12-0f051dacf569")


def _get_headers() -> dict:
    api_key = os.getenv("VAPI_API_KEY")
    if not api_key:
        raise ValueError("VAPI_API_KEY environment variable is not set")
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


def _update_assistant(candidate_name: str, key_skill: str) -> None:
    """Update the Vapi assistant with current ngrok URL, system prompt, and first message."""
    server_url = os.getenv("BACKEND_PUBLIC_URL", "")
    if not server_url:
        raise ValueError("BACKEND_PUBLIC_URL environment variable is not set")

    system_prompt = get_interview_system_prompt(candidate_name, key_skill)

    voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

    payload = {
        "model": {
            "provider": "custom-llm",
            "model": "claude-sonnet-4-20250514",
            "url": f"{server_url}/api/vapi/",
            "messages": [
                {"role": "system", "content": system_prompt},
            ],
        },
        "voice": {
            "provider": "11labs",
            "voiceId": voice_id,
        },
        "firstMessage": (
            f"Hi {candidate_name}, this is the AI screening assistant. "
            "Thanks for taking the time to speak with us today. How are you doing?"
        ),
        "endCallMessage": (
            "Thank you for your time. We'll review everything and get back to you soon. Have a great day!"
        ),
        "serverUrl": f"{server_url}/api/webhooks/vapi/",
        "metadata": {
            "candidate_name": candidate_name,
            "key_skill": key_skill,
        },
    }

    logger.info("Updating Vapi assistant %s with URL %s", VAPI_ASSISTANT_ID, server_url)

    response = requests.patch(
        f"{VAPI_API_URL}/assistant/{VAPI_ASSISTANT_ID}",
        headers=_get_headers(),
        json=payload,
        timeout=15,
    )
    response.raise_for_status()
    logger.info("Vapi assistant updated successfully")


def create_call(candidate_name: str, phone_number: str, key_skill: str = "your primary technical skill") -> dict:
    """
    Update the Vapi assistant with candidate info, then trigger an outbound call.
    Uses the pre-configured assistant on Vapi dashboard.
    """
    phone_number_id = os.getenv("VAPI_PHONE_NUMBER_ID")
    if not phone_number_id:
        raise ValueError("VAPI_PHONE_NUMBER_ID environment variable is not set")

    # Update assistant with candidate-specific prompt and current ngrok URL
    _update_assistant(candidate_name, key_skill)

    payload = {
        "phoneNumberId": phone_number_id,
        "assistantId": VAPI_ASSISTANT_ID,
        "customer": {
            "number": phone_number,
        },
    }

    logger.info("Creating Vapi call to %s for candidate %s", phone_number, candidate_name)

    response = requests.post(
        f"{VAPI_API_URL}/call/phone",
        headers=_get_headers(),
        json=payload,
        timeout=30,
    )
    response.raise_for_status()

    data = response.json()
    logger.info("Vapi call created: call_id=%s", data.get("id"))
    return data
