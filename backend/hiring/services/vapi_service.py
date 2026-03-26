import os
import logging

import requests

logger = logging.getLogger(__name__)

VAPI_API_URL = "https://api.vapi.ai"


def _get_headers() -> dict:
    api_key = os.getenv("VAPI_API_KEY")
    if not api_key:
        raise ValueError("VAPI_API_KEY environment variable is not set")
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


def create_call(candidate_name: str, phone_number: str, key_skill: str = "your primary technical skill") -> dict:
    """
    Trigger a Vapi outbound voice call to the candidate.
    Uses custom LLM endpoint — Vapi sends messages to our Django backend,
    we call Claude directly with our own API key.
    """
    phone_number_id = os.getenv("VAPI_PHONE_NUMBER_ID")
    if not phone_number_id:
        raise ValueError("VAPI_PHONE_NUMBER_ID environment variable is not set")

    voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
    server_url = os.getenv("BACKEND_PUBLIC_URL", "https://your-domain.ngrok.io")

    payload = {
        "phoneNumberId": phone_number_id,
        "customer": {
            "number": phone_number,
        },
        "assistant": {
            "model": {
                "provider": "custom-llm",
                "url": f"{server_url}/api/vapi/chat/completions/",
                "model": "claude-sonnet-4-20250514",
            },
            "voice": {
                "provider": "11labs",
                "voiceId": voice_id,
            },
            "firstMessage": f"Hi {candidate_name}, this is the AI screening assistant. Thanks for taking the time to speak with us today. How are you doing?",
            "endCallMessage": "Thank you for your time. We'll review everything and get back to you soon. Have a great day!",
            "metadata": {
                "candidate_name": candidate_name,
                "key_skill": key_skill,
            },
            "serverUrl": f"{server_url}/api/webhooks/vapi/",
        },
    }

    logger.info("Creating Vapi call to %s for candidate %s (custom LLM)", phone_number, candidate_name)

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
