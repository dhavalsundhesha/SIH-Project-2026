import os
from anthropic import Anthropic, APIConnectionError, APIStatusError, RateLimitError

MODEL_NAME = os.getenv("MODEL_NAME", "claude-sonnet-4-6")
_client = None


class AIServiceNotConfiguredError(Exception):
    pass


class AIServiceUnavailableError(Exception):
    pass


def get_client() -> Anthropic:
    global _client
    if _client is None:
        api_key = os.getenv("CLOUD_AI_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise AIServiceNotConfiguredError("CLOUD_AI_API_KEY is not set. Add it to ai-service/.env")
        _client = Anthropic(api_key=api_key)
    return _client


def generate_text(system_prompt: str, user_prompt: str, max_tokens: int = 500) -> str:
    client = get_client()
    try:
        response = client.messages.create(
            model=MODEL_NAME,
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
    except RateLimitError as exc:
        raise AIServiceUnavailableError("Mittu is a bit busy right now. Try again shortly.") from exc
    except APIConnectionError as exc:
        raise AIServiceUnavailableError("Could not reach the Cloud AI provider.") from exc
    except APIStatusError as exc:
        raise AIServiceUnavailableError(f"Cloud AI provider returned an error (status {exc.status_code}).") from exc

    return "".join(block.text for block in response.content if block.type == "text").strip()
