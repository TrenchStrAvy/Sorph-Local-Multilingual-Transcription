"""Personal dictionary for Sorph: words Whisper should know.

An entry is one of

* a word or name, spelled the way it should be written: "Ollama",
  "Terraform", "tmux". Whisper is told to expect it (faster-whisper's
  hotwords), and whenever it comes out in another case ("ollama") the
  spelling of the entry wins.
* a fix for a mishearing, "heard = written": "terror form = Terraform",
  "Olama = Ollama". Every "heard" in a transcript becomes "written", and
  "written" is also given to Whisper as a word to expect.

Entries live in settings ("dictionary"); the menu bar and --add-word edit
them.
"""

import re

MAX_HOTWORD_CHARS = 400       # the hint shares Whisper's prompt budget
_SPLIT = re.compile(r"\s*(?:=|->|→)\s*")


def parse(entry: str):
    """(heard or None, written) for one entry."""
    parts = _SPLIT.split(entry.strip(), maxsplit=1)
    if len(parts) == 2 and parts[0] and parts[1]:
        return parts[0], parts[1]
    return None, entry.strip()


def hotwords(entries) -> str:
    """The words to bias Whisper towards, as one string ("" for none)."""
    out, size = [], 0
    for entry in entries:
        word = parse(entry)[1]
        if not word or word in out:
            continue
        if size + len(word) + 1 > MAX_HOTWORD_CHARS:
            break
        out.append(word)
        size += len(word) + 1
    return " ".join(out)


def _norm(word: str) -> str:
    return re.sub(r"[\W_]+", "", word, flags=re.UNICODE).lower()


def echo_start(text: str, hint: str):
    """Where a possible read-back of the hint begins in `text`, or None.

    The hint is fed to Whisper as if it were text said just before; on a
    breath or a pause the decoder sometimes carries on by copying it
    ("... take me to the... Sorph Singe CySA"). That copy is a trailing
    run of hint words in the hint's own order. Whether the user really
    said them is for the audio to tell (see heard_again)."""
    hint_words = [_norm(w) for w in hint.split()]
    norm = [_norm(w) for w in text.split()]
    if not hint_words or not norm:
        return None
    found = None
    for start in range(len(norm) - 1, -1, -1):
        run = norm[start:]
        if not any(hint_words[i:i + len(run)] == run
                   for i in range(len(hint_words) - len(run) + 1)):
            break
        found = start
    return found


# How much what the plain decode heard must look like the dictionary words.
# After other speech an echo leaves nothing in the plain decode, so a loose
# likeness will do: spoken "Sorph" comes out "Swarf" (0.4), "Singe" as
# "Cinch" (0.4). A segment of nothing but dictionary words is stricter, as
# a breath alone can make Whisper invent "Thanks for watching!" (0.45 to
# "Sorph Singe CySA+"); spoken, they come out "Sorf Cinch" (0.53), "Soft
# Singe" (0.74), "Soar" (0.67).
HEARD_AFTER_SPEECH = 0.25
HEARD_ALONE = 0.5


def heard_again(text: str, start: int, plain: str) -> bool:
    """Did a decode of the same audio without the hint (`plain`) also
    hear the words of `text` from word `start` on?

    `plain` is lined up with the words before `start`; whatever it has
    beyond them is what the audio holds in the run's place. Without the
    hint Whisper misspells the user's words ("SOARF" for "Sorph"), so
    that rest only has to sound alike; an echo leaves no rest at all,
    or nothing like the words."""
    from difflib import SequenceMatcher
    words = text.split()
    before = [_norm(w) for w in words[:start]]
    run = "".join(_norm(w) for w in words[start:])
    heard = [_norm(w) for w in plain.split()]
    heard = [w for w in heard if w]
    rest = heard[len(before):]
    if before:
        blocks = [b for b in SequenceMatcher(None, before, heard,
                                             autojunk=False)
                  .get_matching_blocks() if b.size]
        if blocks:
            rest = heard[blocks[-1].b + blocks[-1].size:]
    rest = "".join(rest)
    if not rest or not run:
        return False
    need = HEARD_AFTER_SPEECH if before else HEARD_ALONE
    return SequenceMatcher(None, run, rest, autojunk=False).ratio() >= need


def _pattern(phrase: str):
    words = [re.escape(w) for w in phrase.split()]
    return re.compile(r"(?<![\w'’])" + r"\s+".join(words) + r"(?![\w'’])",
                      re.IGNORECASE | re.UNICODE)


def apply(text: str, entries) -> str:
    """Rewrite mishearings and settle the spelling of dictionary words."""
    if not text:
        return text
    for entry in entries:
        heard, written = parse(entry)
        if not written:
            continue
        for phrase in ([heard] if heard else []) + [written]:
            text = _pattern(phrase).sub(lambda _m: written, text)
    return text
