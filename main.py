from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="VoteReady API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key="sk-dummy") if os.getenv("OPENAI_API_KEY") else None

SYSTEM_PROMPT = """
You are VoteReady Assistant — a helpful, neutral, and friendly guide for first-time Indian voters aged 18–25.

YOUR ROLE:
- Help users understand how to vote in India (Lok Sabha, Vidhan Sabha elections)
- Explain voter registration, polling booths, EVM machines, and election procedures
- Answer questions about documents needed, eligibility, and what to expect on election day
- Keep explanations simple, clear, and encouraging

STRICT RULES:
1. NEVER express political opinions or bias toward any party, candidate, or ideology
2. NEVER recommend who to vote for
3. If asked about political parties or candidates, politely decline and redirect to the process
4. NEVER make up facts — if unsure, say so and recommend the ECI website (voters.eci.gov.in)
5. Keep answers short and beginner-friendly — the user is likely voting for the first time
6. Use Indian context: mention Aadhaar, EPIC card, EVM, VVPAT, ECI, Form 6, etc.
7. Stay on topic. If asked unrelated questions, gently redirect to voting.

TONE:
- Friendly and encouraging, like a helpful older sibling
- Simple language, no jargon
- Bullet points when listing steps

USEFUL FACTS (use these):
- Voter helpline: 1950
- Register at: voters.eci.gov.in
- Minimum age: 18 years
- Key document: EPIC (Voter ID) card or Aadhaar
- Indelible ink is applied to left index finger after voting
- EVMs are used — press the button next to your candidate's symbol
- VVPAT lets you verify your vote
- Polling booths are open 7am to 6pm typically
"""

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    current_step: Optional[int] = None

class ChatResponse(BaseModel):
    reply: str

@app.get("/")
def root():
    return {"status": "VoteReady API running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        system = SYSTEM_PROMPT
        if req.current_step is not None:
            system += f"\n\nCONTEXT: The user is currently reading Step {req.current_step} of the voting guide. Tailor your answer to be relevant to this step if possible."

        messages = [{"role": "system", "content": system}]
        for msg in req.messages:
            messages.append({"role": msg.role, "content": msg.content})

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=500,
            temperature=0.5,
        )

        reply = response.choices[0].message.content
        return ChatResponse(reply=reply)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/guide")
def get_guide():
    return {
        "steps": [
            {
                "id": 1,
                "phase": "before",
                "title": "Check your eligibility",
                "description": "You must be an Indian citizen, 18+ years old, and a resident of the constituency where you want to vote.",
                "tip": "Do this first",
                "detail": "If you turned 18 before January 1st of the election year, you are eligible. NRIs with Indian passports can also register.",
                "color": "purple"
            },
            {
                "id": 2,
                "phase": "before",
                "title": "Register to vote",
                "description": "Register on the ECI website (voters.eci.gov.in) using Form 6. You'll need Aadhaar and proof of address.",
                "tip": "Do weeks before",
                "detail": "Registration deadlines vary. Check the ECI website for your state's cutoff date. You can also register offline at your local BLO (Booth Level Officer).",
                "color": "teal"
            },
            {
                "id": 3,
                "phase": "before",
                "title": "Get your Voter ID (EPIC card)",
                "description": "After registration, your EPIC card will be dispatched. You can also download a digital version from the ECI app.",
                "tip": "Keep it safe",
                "detail": "EPIC = Electors Photo Identity Card. If not received, you can use 11 other approved documents like Aadhaar, passport, or PAN card with photo.",
                "color": "blue"
            },
            {
                "id": 4,
                "phase": "before",
                "title": "Find your polling booth",
                "description": "Your polling station is assigned based on your address. Find it on voters.eci.gov.in or call 1950.",
                "tip": "Know in advance",
                "detail": "Your Voter Slip will arrive a few days before election day. It has your booth number, serial number, and polling station address.",
                "color": "amber"
            },
            {
                "id": 5,
                "phase": "before",
                "title": "Research candidates & issues",
                "description": "Read about candidates from multiple neutral sources. Vote based on what matters most to you — not just social media.",
                "tip": "Your choice",
                "detail": "Candidate details are available on the ECI's Candidate Affidavit portal. You can see their assets, education, and criminal record if any — all public information.",
                "color": "coral"
            },
            {
                "id": 6,
                "phase": "election_day",
                "title": "Bring your ID to the booth",
                "description": "Carry your EPIC card or any of the 12 approved documents. Arrive at your polling station during voting hours (usually 7am–6pm).",
                "tip": "Must carry",
                "detail": "Approved alternatives: Aadhaar, Passport, Driving License, PAN Card, MNREGA Job Card, Service ID Cards with photo, Passbook with photo, Smart card, Pension document, NPR card, or Disability certificate.",
                "color": "green"
            },
            {
                "id": 7,
                "phase": "election_day",
                "title": "Cast your vote on the EVM",
                "description": "Enter the booth, find your candidate's symbol on the EVM, and press the blue button next to it. Wait for the beep.",
                "tip": "Private & secure",
                "detail": "EVM = Electronic Voting Machine. After pressing, the VVPAT (Voter Verified Paper Audit Trail) machine shows a slip with your candidate's name and symbol for 7 seconds — this is your verification.",
                "color": "purple"
            },
            {
                "id": 8,
                "phase": "election_day",
                "title": "Get your ink mark & leave",
                "description": "The officer marks indelible ink on your left index finger. This prevents double voting. You're done!",
                "tip": "You voted!",
                "detail": "The ink stays for several days and cannot be washed off. It's your badge of civic participation.",
                "color": "teal"
            }
        ]
    }
