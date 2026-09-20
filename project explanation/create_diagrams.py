# -*- coding: utf-8 -*-
"""
Generate high-resolution visual diagrams for Margdarshak AI Report
Created for Founder Mehak | SIH 2024 Edition
"""

import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Arrow

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "diagrams")
os.makedirs(OUT_DIR, exist_ok=True)

# Common Palette
C_PRIMARY = "#312E81"     # Indigo-900
C_ACCENT = "#4F46E5"      # Indigo-600
C_CYAN = "#0EA5E9"        # Sky-500
C_GREEN = "#10B981"       # Emerald-500
C_PURPLE = "#8B5CF6"      # Violet-500
C_AMBER = "#F59E0B"       # Amber-500
C_DARK = "#0F172A"        # Slate-900
C_CARD = "#FFFFFF"
C_BG = "#F8FAFC"
C_BORDER = "#CBD5E1"

def draw_badge(ax, x, y, w, h, text, bg_color, text_color="white", font_size=8.5, weight="bold"):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.04,rounding_size=0.15",
                         facecolor=bg_color, edgecolor=C_BORDER, linewidth=0.8)
    ax.add_patch(box)
    ax.text(x + w/2, y + h/2, text, color=text_color, fontsize=font_size,
            fontweight=weight, ha='center', va='center', family='sans-serif')

# ==========================================
# 1. SYSTEM ARCHITECTURE DIAGRAM
# ==========================================
def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(10, 5.8), dpi=250)
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6.2)
    ax.axis('off')

    # Title
    ax.text(5, 5.85, "MARGDARSHAK AI — FULL-STACK HYBRID ARCHITECTURE",
            fontsize=13, fontweight='bold', color=C_PRIMARY, ha='center', family='sans-serif')
    ax.text(5, 5.58, "Client-First Edge Deployment with Progressive Cloud Enhancement • Created by Mehak",
            fontsize=9, color="#64748B", ha='center', family='sans-serif')

    # Layer 1: Client Access & Edge CDN
    draw_badge(ax, 0.6, 4.4, 2.2, 0.75, "User / Student Aspirant\n(Mobile, Tablet, Laptop)", C_PRIMARY, font_size=8)
    draw_badge(ax, 3.8, 4.4, 2.4, 0.75, "Vercel Edge Global CDN\n(Instant Low-Latency Delivery)", C_ACCENT, font_size=8)
    draw_badge(ax, 7.2, 4.4, 2.2, 0.75, "PWA Offline Engine\n(Service Worker sw.js Cache)", C_PURPLE, font_size=8)

    # Arrows Layer 1
    ax.annotate("", xy=(3.7, 4.77), xytext=(2.9, 4.77),
                arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.5))
    ax.annotate("", xy=(7.1, 4.77), xytext=(6.3, 4.77),
                arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.5))

    # Big Box: Client Single Page Application (SPA)
    spa_box = FancyBboxPatch((0.6, 1.8), 8.8, 2.2, boxstyle="round,pad=0.06,rounding_size=0.15",
                             facecolor="#FFFFFF", edgecolor="#818CF8", linewidth=1.5, linestyle="--")
    ax.add_patch(spa_box)
    ax.text(0.9, 3.75, "Client Browser Single Page Application (Vanilla ES6+ JavaScript & Tailwind CSS)",
            fontsize=8.5, fontweight='bold', color=C_PRIMARY, family='sans-serif')

    # 4 Core Modules Inside SPA
    draw_badge(ax, 0.9, 2.1, 1.9, 1.4, "Resume Gap Analyzer\n• 60+ Companies\n• PDF.js Text Parser\n• 15-Day Roadmap", "#EEF2FF", text_color=C_PRIMARY, font_size=7.5)
    draw_badge(ax, 3.1, 2.1, 1.9, 1.4, "Smart Scholarship Engine\n• 25+ Real Schemes\n• 6-Factor Filter\n• AI SOP Co-Pilot", "#ECFDF5", text_color="#065F46", font_size=7.5)
    draw_badge(ax, 5.3, 2.1, 1.9, 1.4, "Voice AI Mock Interview\n• 200+ Questions\n• Web Speech TTS/STT\n• 10-Pt Scorecard", "#FAF5FF", text_color="#581C87", font_size=7.5)
    draw_badge(ax, 7.5, 2.1, 1.7, 1.4, "Bharat Inclusivity\n• 9 Indian Languages\n• Universal Auth\n• WhatsApp Share", "#FEF3C7", text_color="#92400E", font_size=7.5)

    # Layer 3: Cloud Enhancements
    draw_badge(ax, 1.5, 0.35, 3.2, 0.85, "Google Gemini 1.5 Flash AI Engine\n(Qualitative Analysis & Dynamic SOP Polish)", C_CYAN, font_size=8)
    draw_badge(ax, 5.5, 0.35, 3.2, 0.85, "Multi-User Cloud DB Adapter\n(PostgreSQL / Supabase / MongoDB Sync)", C_GREEN, font_size=8)

    # Connections from SPA to Cloud
    ax.annotate("", xy=(3.1, 1.25), xytext=(3.1, 1.75),
                arrowprops=dict(arrowstyle="<->", color="#0EA5E9", lw=1.5, linestyle=":"))
    ax.annotate("", xy=(7.1, 1.25), xytext=(7.1, 1.75),
                arrowprops=dict(arrowstyle="<->", color="#10B981", lw=1.5, linestyle=":"))

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "diagram_architecture.png"), bbox_inches='tight', dpi=300)
    plt.close()

# ==========================================
# 2. RESUME GAP ANALYZER PIPELINE
# ==========================================
def create_resume_pipeline_diagram():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=250)
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.8)
    ax.axis('off')

    ax.text(5, 4.45, "RESUME VS DREAM JOB GAP ANALYZER — DATA PIPELINE",
            fontsize=12.5, fontweight='bold', color=C_PRIMARY, ha='center', family='sans-serif')
    ax.text(5, 4.18, "From Unstructured Student CV to 15-Day Targeted Upskilling Action Roadmap",
            fontsize=8.5, color="#64748B", ha='center', family='sans-serif')

    steps = [
        ("Step 1: Input", "• PDF / DOCX Upload\n• Raw Text Paste\n• 3 Sample Profiles", C_PRIMARY),
        ("Step 2: Parsing", "• In-Browser PDF.js\n• Regex Normalizer\n• Keyword Tokenizer", C_ACCENT),
        ("Step 3: Matching", "• 60+ Company DB\n• Core Skill Check\n• Bonus Skill Check", C_PURPLE),
        ("Step 4: Scoring", "• Weighted Formula:\n  70% Core + 30% Bonus\n• Score Assessment", C_CYAN),
        ("Step 5: Output", "• Animated SVG Ring\n• Missing Skill Badges\n• 15-Day Roadmap", C_GREEN),
    ]

    for i, (title, desc, bg) in enumerate(steps):
        x = 0.5 + i * 1.9
        draw_badge(ax, x, 1.0, 1.55, 2.4, f"{title}\n\n{desc}", bg, font_size=7.5)
        if i < 4:
            ax.annotate("", xy=(x + 1.85, 2.2), xytext=(x + 1.58, 2.2),
                        arrowprops=dict(arrowstyle="->", color="#94A3B8", lw=2))

    # Formula Box at bottom
    ax.text(5, 0.45, "ATS Formula: Score = [ (Matched Core / Total Core) * 70% ] + [ (Matched Bonus / Total Bonus) * 30% ]",
            fontsize=8.5, fontweight='bold', color=C_PRIMARY, ha='center',
            bbox=dict(boxstyle="round,pad=0.4", facecolor="#EEF2FF", edgecolor="#818CF8", lw=0.8))

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "diagram_resume_pipeline.png"), bbox_inches='tight', dpi=300)
    plt.close()

# ==========================================
# 3. VOICE AI MOCK INTERVIEWER PIPELINE
# ==========================================
def create_mock_voice_diagram():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=250)
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.8)
    ax.axis('off')

    ax.text(5, 4.45, "REAL-TIME VOICE AI MOCK INTERVIEWER — INTERACTION FLOW",
            fontsize=12.5, fontweight='bold', color=C_PRIMARY, ha='center', family='sans-serif')
    ax.text(5, 4.18, "Bi-directional Audio Synthesis, Speech-to-Text Recognition & Rubric Scorecard",
            fontsize=8.5, color="#64748B", ha='center', family='sans-serif')

    steps = [
        ("1. Role Select", "• Target Company\n• Role & Level\n• 200+ Bank Fetch", C_PRIMARY),
        ("2. Voice TTS", "• HTML5 Synthesis\n• Natural Cadence\n• Reads Question", C_PURPLE),
        ("3. Spoken Answer", "• Microphone Input\n• Web Speech STT\n• Real-Time Transcript", C_CYAN),
        ("4. Rubric Eval", "• Technical (4 pts)\n• Structure (2 pts)\n• STAR Compliance", C_AMBER),
        ("5. Scorecard", "• 10-Point Score\n• What You Did Well\n• Next Improvements", C_GREEN),
    ]

    for i, (title, desc, bg) in enumerate(steps):
        x = 0.5 + i * 1.9
        draw_badge(ax, x, 1.1, 1.55, 2.3, f"{title}\n\n{desc}", bg, font_size=7.5)
        if i < 4:
            ax.annotate("", xy=(x + 1.85, 2.25), xytext=(x + 1.58, 2.25),
                        arrowprops=dict(arrowstyle="->", color="#94A3B8", lw=2))

    ax.text(5, 0.45, "Rubric Metrics: Technical Accuracy (4) + Depth & Clarity (2) + STAR Method (2) + Confidence (2) = 10 Pts",
            fontsize=8.5, fontweight='bold', color=C_PRIMARY, ha='center',
            bbox=dict(boxstyle="round,pad=0.4", facecolor="#FAF5FF", edgecolor="#C084FC", lw=0.8))

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "diagram_mock_voice.png"), bbox_inches='tight', dpi=300)
    plt.close()

# ==========================================
# 4. VISUAL FILE & CODEBASE ARCHITECTURE
# ==========================================
def create_file_structure_diagram():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=250)
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7.0)
    ax.axis('off')

    ax.text(5, 6.65, "MARGDARSHAK AI — VISUAL CODEBASE & FILE STRUCTURE",
            fontsize=13, fontweight='bold', color=C_PRIMARY, ha='center', family='sans-serif')
    ax.text(5, 6.35, "Comprehensive Modular Directory Mapping & Engineering Responsibilities",
            fontsize=9, color="#64748B", ha='center', family='sans-serif')

    # Root Box
    draw_badge(ax, 0.5, 5.3, 9.0, 0.75, "margdarshak-ai/ (Root Directory) — Production Vercel Edge Deployed", C_PRIMARY, font_size=9)

    # 4 Columns of folders/files
    col_w = 2.05
    # Col 1: Core Web & PWA
    draw_badge(ax, 0.5, 4.3, col_w, 0.55, "Core Web & PWA", C_ACCENT, font_size=8)
    draw_badge(ax, 0.5, 0.6, col_w, 3.5, 
               "• index.html\n  (Single Page UI)\n\n"
               "• sw.js\n  (Service Worker)\n\n"
               "• manifest.json\n  (PWA Install)\n\n"
               "• vercel.json\n  (Edge Routing)\n\n"
               "• package.json\n  (Project Metadata)",
               "#FFFFFF", text_color=C_DARK, font_size=7.5, weight="normal")

    # Col 2: CSS Styles
    draw_badge(ax, 2.8, 4.3, col_w, 0.55, "Styles & Tokens", C_PURPLE, font_size=8)
    draw_badge(ax, 2.8, 0.6, col_w, 3.5,
               "• css/style.css\n  (Custom Styles)\n\n"
               "• Dark/Light Tokens\n  (Glassmorphism)\n\n"
               "• Keyframe Animations\n  (Pulse, Glow, Shimmer)\n\n"
               "• Responsive Grid\n  (Mobile/Tablet/PC)\n\n"
               "• SVG Metric Classes\n  (Radial Meter Dash)",
               "#FFFFFF", text_color=C_DARK, font_size=7.5, weight="normal")

    # Col 3: JS Engines
    draw_badge(ax, 5.1, 4.3, col_w, 0.55, "JavaScript Engines", C_CYAN, font_size=8)
    draw_badge(ax, 5.1, 0.6, col_w, 3.5,
               "• js/app.js\n  (Master Orchestrator)\n\n"
               "• js/gapAnalyzer.js\n  (Resume ATS & Roadmap)\n\n"
               "• js/scholarshipEngine.js\n  (Filters & SOP Writer)\n\n"
               "• js/mockInterviewer.js\n  (Speech TTS & STT)\n\n"
               "• js/auth.js\n  (Delegated Auth & Seeds)",
               "#FFFFFF", text_color=C_DARK, font_size=7.5, weight="normal")

    # Col 4: Data & Backend
    draw_badge(ax, 7.4, 4.3, col_w, 0.55, "Data & Cloud API", C_GREEN, font_size=8)
    draw_badge(ax, 7.4, 0.6, col_w, 3.5,
               "• data/companies.js\n  (60+ Company Profiles)\n\n"
               "• data/scholarships.js\n  (25+ Indian Schemes)\n\n"
               "• data/interviewQuestions.js\n  (200+ Question Bank)\n\n"
               "• data/translations.js\n  (9 Indian Languages)\n\n"
               "• server.js\n  (Node REST API & Cloud)",
               "#FFFFFF", text_color=C_DARK, font_size=7.5, weight="normal")

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "diagram_file_structure.png"), bbox_inches='tight', dpi=300)
    plt.close()

# ==========================================
# 5. SCHOLARSHIP DECISION MATRIX
# ==========================================
def create_scholarship_matrix_diagram():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=250)
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.8)
    ax.axis('off')

    ax.text(5, 4.45, "SMART SCHOLARSHIP ENGINE & AI SOP CO-PILOT WORKFLOW",
            fontsize=12.5, fontweight='bold', color=C_PRIMARY, ha='center', family='sans-serif')
    ax.text(5, 4.18, "Multi-Factor Eligibility Matching & Automated Committee-Ready Statement of Purpose",
            fontsize=8.5, color="#64748B", ha='center', family='sans-serif')

    steps = [
        ("1. Profile Input", "• Family Income\n• Marks Slider (40-98%)\n• Category (OBC/SC/EWS)\n• Gender & State", C_PRIMARY),
        ("2. Filter Engine", "• 25+ Schemes Match\n• Exclusion Matrix\n• Income Thresholds\n• State Quotas", C_CYAN),
        ("3. Verified Schemes", "• AICTE Pragati\n• Reliance Foundation\n• Tata Trust Grants\n• Direct Portal Links", C_PURPLE),
        ("4. AI SOP Co-Pilot", "• 4-Paragraph Format\n• Academic Passion\n• Financial Need\n• Social Vision", C_GREEN),
        ("5. Application", "• 1-Click Copy SOP\n• Download .txt File\n• Direct Portal Apply\n• Track in Dashboard", C_AMBER),
    ]

    for i, (title, desc, bg) in enumerate(steps):
        x = 0.5 + i * 1.9
        draw_badge(ax, x, 1.1, 1.55, 2.3, f"{title}\n\n{desc}", bg, font_size=7.5)
        if i < 4:
            ax.annotate("", xy=(x + 1.85, 2.25), xytext=(x + 1.58, 2.25),
                        arrowprops=dict(arrowstyle="->", color="#94A3B8", lw=2))

    ax.text(5, 0.45, "Impact: Eliminates Rs. 2,000+ Crore scholarship underutilization by empowering Tier-2/3 students",
            fontsize=8.5, fontweight='bold', color="#065F46", ha='center',
            bbox=dict(boxstyle="round,pad=0.4", facecolor="#ECFDF5", edgecolor="#34D399", lw=0.8))

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "diagram_scholarship_matrix.png"), bbox_inches='tight', dpi=300)
    plt.close()

if __name__ == "__main__":
    print("Generating diagrams...")
    create_architecture_diagram()
    create_resume_pipeline_diagram()
    create_mock_voice_diagram()
    create_file_structure_diagram()
    create_scholarship_matrix_diagram()
    print(f"All 5 diagrams successfully generated in {OUT_DIR}")
