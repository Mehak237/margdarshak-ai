# -*- coding: utf-8 -*-
"""
Margdarshak AI - Executive Technical Report PDF Generator
Created for Founder Mehak | Smart India Hackathon (SIH 2024 Edition)
"""

import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

PDF_OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "Margdarshak AI report.pdf"
)

class NumberedCanvas(canvas.Canvas):
    """Canvas that computes total pages dynamically for 'Page X of Y' footers."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 810, "Margdarshak AI — Technical Project & Architecture Report")
            self.drawRightString(A4[0] - 40, 810, "Created by Mehak | SIH 2024 Edition")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(40, 804, A4[0] - 40, 804)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(40, 36, A4[0] - 40, 36)
        
        footer_text_left = "Margdarshak AI • Live Platform: margdarshak-ai-khaki.vercel.app"
        self.drawString(40, 24, footer_text_left)
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 40, 24, page_str)
        self.restoreState()

def build_pdf():
    doc = SimpleDocTemplate(
        PDF_OUTPUT_PATH,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#312E81")     # Indigo-900
    c_accent = colors.HexColor("#4F46E5")      # Indigo-600
    c_dark = colors.HexColor("#0F172A")        # Slate-900
    c_body = colors.HexColor("#334155")        # Slate-700
    c_light_bg = colors.HexColor("#F8FAFC")    # Slate-50
    c_border = colors.HexColor("#CBD5E1")      # Slate-300
    c_green = colors.HexColor("#16A34A")       # Green-600

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.white,
        alignment=0,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#E0E7FF"),
        spaceAfter=10
    )

    meta_style = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.white
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=15,
        textColor=c_primary,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=c_accent,
        spaceBefore=9,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=c_body,
        spaceAfter=5,
        alignment=4 # Justified
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_body,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_dark
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=c_dark
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=c_primary
    )

    story = []

    # 1. HEADER HERO BANNER
    header_content = [
        [Paragraph("<b>SMART INDIA HACKATHON (SIH 2024 EDITION) • OFFICIAL TECHNICAL REPORT</b>", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#FEF08A"), spaceAfter=4))],
        [Paragraph("MARGDARSHAK AI", title_style)],
        [Paragraph('"From Classroom to Dream Career — Guided by AI"', subtitle_style)],
        [HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#818CF8"), spaceBefore=0, spaceAfter=8)],
        [
            Table([
                [
                    Paragraph("<b>Founder & Lead Developer:</b> Mehak", meta_style),
                    Paragraph("<b>Live Platform:</b> margdarshak-ai-khaki.vercel.app", meta_style)
                ],
                [
                    Paragraph("<b>Edition & Track:</b> SIH 2024 Edition", meta_style),
                    Paragraph("<b>GitHub:</b> github.com/Mehak237/margdarshak-ai", meta_style)
                ]
            ], colWidths=[240, 260], style=[
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                ('TOPPADDING', (0, 0), (-1, -1), 2),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ])
        ]
    ]

    header_table = Table(header_content, colWidths=[515])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#312E81")),
        ('LEFTPADDING', (0, 0), (-1, -1), 16),
        ('RIGHTPADDING', (0, 0), (-1, -1), 16),
        ('TOPPADDING', (0, 0), (-1, -1), 14),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))

    # 2. EXECUTIVE SUMMARY
    story.append(Paragraph("1. Executive Summary", h1_style))
    story.append(Paragraph(
        "In India's higher education ecosystem, over <b>1.5 million engineers and degree graduates</b> enter the job market annually. "
        "However, national surveys (including the Wheebox India Skills Report) reveal that <b>less than 45% of graduating students from Tier-2 and Tier-3 colleges</b> "
        "possess industry-ready technical, behavioral, and communication proficiencies. The root cause is an acute <b>information and mentorship divide</b>: "
        "students lack insight into company-specific ATS expectations, miss out on thousands of crores in unutilized scholarships, and cannot afford expensive private placement coaching.",
        body_style
    ))

    callout_data = [[
        Paragraph(
            "<b>Core Project Innovation:</b> Margdarshak AI is an end-to-end, zero-cost, browser-based career co-pilot architected and developed by <b>Mehak</b>. "
            "It bridges this gap through instant <b>Resume vs. Dream Job Gap Analysis</b> across 60+ Indian employers, <b>25+ verified scholarships</b> with an AI Statement of Purpose (SOP) writer, "
            "<b>real-time interactive voice AI mock interviews</b> with instant scoring, and complete <b>multilingual support in 9 Indian languages</b>.",
            callout_style
        )
    ]]
    callout_tbl = Table(callout_data, colWidths=[515])
    callout_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EEF2FF")),
        ('LINELEFT', (0, 0), (0, -1), 3.5, colors.HexColor("#4F46E5")),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(callout_tbl)
    story.append(Spacer(1, 6))

    # 3. PROBLEM STATEMENT & GROUND REALITIES
    story.append(Paragraph("2. Problem Statement & Ground Realities in Tier-2/3 Colleges", h1_style))
    problems = [
        "<b>1. The Vague Job Description & ATS Trap:</b> Students submit generic resumes lacking company-specific core keywords, leading to automated ATS disqualification before human review.",
        "<b>2. Massive Scholarship Information Asymmetry:</b> Over Rs. 2,000 Crores in central, state, and corporate scholarship funds go unused because students are unaware of eligibility or cannot draft strong Statements of Purpose.",
        "<b>3. Exorbitant Private Coaching Fees:</b> Commercial interview coaching services charge Rs. 1,500 - Rs. 3,000 per session, completely out of reach for students from humble economic backgrounds.",
        "<b>4. The Linguistic Divide:</b> Standard technical career coaching is almost exclusively in English, triggering severe anxiety among vernacular-speaking students during campus recruitment drives."
    ]
    for p in problems:
        story.append(Paragraph(f"• {p}", bullet_style))
    story.append(Spacer(1, 6))

    # 4. SYSTEM ARCHITECTURE
    story.append(Paragraph("3. Technical Architecture & Hybrid Edge Design", h1_style))
    story.append(Paragraph(
        "Margdarshak AI adopts a <b>Hybrid Edge-First Architecture</b>. It runs 100% client-side by default—delivering <b>0ms cold starts</b>, total student data privacy, and zero operational server costs—while offering progressive cloud enhancement via Google Gemini 1.5 Flash and multi-user database adapters.",
        body_style
    ))

    arch_rows = [
        [Paragraph("<b>Component Layer</b>", table_header_style), Paragraph("<b>Technologies Used</b>", table_header_style), Paragraph("<b>Technical Responsibility</b>", table_header_style)],
        [Paragraph("<b>Frontend UI/UX</b>", table_cell_bold), Paragraph("Vanilla HTML5, Tailwind CSS, Lucide Icons", table_cell_style), Paragraph("Semantic single-page application with responsive dark/light glassmorphism interface.", table_cell_style)],
        [Paragraph("<b>Resume Engine</b>", table_cell_bold), Paragraph("PDF.js Client-Side Worker", table_cell_style), Paragraph("Extracts text locally in browser memory without sending private CVs to external servers.", table_cell_style)],
        [Paragraph("<b>Voice Interviewer</b>", table_cell_bold), Paragraph("Web Speech Synthesis & SpeechRecognition API", table_cell_style), Paragraph("Vocalizes questions and captures spoken answers through microphone in real time.", table_cell_style)],
        [Paragraph("<b>Offline / PWA</b>", table_cell_bold), Paragraph("Service Worker (sw.js) & Web App Manifest", table_cell_style), Paragraph("Caches assets locally for low-bandwidth operation on unstable college networks.", table_cell_style)],
        [Paragraph("<b>AI Engine</b>", table_cell_bold), Paragraph("Google Gemini 1.5 Flash + Local Heuristics", table_cell_style), Paragraph("Dual-mode: deterministic offline rule engine plus dynamic Gemini generative evaluation.", table_cell_style)],
        [Paragraph("<b>Backend & Cloud</b>", table_cell_bold), Paragraph("Node.js REST API (server.js) / Supabase / MongoDB", table_cell_style), Paragraph("Cloud database sync for multi-user student profiles and scan history persistence.", table_cell_style)],
        [Paragraph("<b>Hosting & Edge</b>", table_cell_bold), Paragraph("Vercel Global Edge Network", table_cell_style), Paragraph("Global CDN distribution with automated CI/CD directly from GitHub repository.", table_cell_style)]
    ]
    arch_tbl = Table(arch_rows, colWidths=[100, 160, 255])
    arch_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#312E81")),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
    ]))
    story.append(arch_tbl)
    story.append(Spacer(1, 8))

    # 5. CORE MODULES DEEP DIVE (WHAT WAS BUILT BY MEHAK)
    story.append(Paragraph("4. Core Features Deep Dive — Built by Mehak", h1_style))
    
    story.append(Paragraph("4.1 Resume vs. Dream Job Gap Analyzer & 15-Day Roadmap", h2_style))
    story.append(Paragraph(
        "• <b>60+ Indian Tech Employers:</b> Encompasses Product Giants (Google, Amazon, Microsoft, Adobe), IT Titans (TCS Ninja & Digital, Infosys SE & DSE, Wipro, Cognizant, LTIMindtree), E-commerce/Unicorns (Flipkart, Swiggy, Zomato, CRED), and Fintech (Goldman Sachs, Morgan Stanley).<br/>"
        "• <b>Algorithmic ATS Matching:</b> Compares applicant skills against company benchmarks, separating <i>Critical Must-Have Skills</i> from <i>Bonus Competitive Skills</i>.<br/>"
        "• <b>Dynamic SVG Progress Meter:</b> Real-time SVG circular meter with reactive color grading (Green >=80%, Amber 60-79%, Rose <60%).<br/>"
        "• <b>Automated 15-Day Action Roadmap:</b> Phase 1 (Days 1-5: Foundation repair), Phase 2 (Days 6-10: Hands-on project building), Phase 3 (Days 11-15: Mock interviews and system design).<br/>"
        "• <b>Pitch Evaluator:</b> NLP evaluation of candidate's 60-second 'Tell Me About Yourself' elevator pitch.",
        bullet_style
    ))

    story.append(Paragraph("4.2 Smart Scholarship Engine & AI SOP Co-Pilot", h2_style))
    story.append(Paragraph(
        "• <b>25+ Verified Indian Schemes:</b> Curated database including AICTE Pragati (Rs. 50,000/yr for girls), Reliance Foundation (Rs. 2,00,000), Tata Trust, NSP Central Sector, Post-Matric SC/ST, and ONGC Scholars.<br/>"
        "• <b>6-Dimensional Real-Time Filter:</b> Filters simultaneously by Family Income (Rs. 1.5L to Rs. 8L EWS ceiling), Academic Percentage (40% to 98% slider), Social Category, Gender, Domicile State, and Degree Level.<br/>"
        "• <b>Committee-Ready AI SOP Co-Pilot:</b> Generates professional 4-paragraph Statements of Purpose tailored to selection committees, emphasizing academic passion, financial resilience, and future commitment to society.",
        bullet_style
    ))

    story.append(Paragraph("4.3 Real-Time Voice AI Mock Interviewer with Live Scorecard", h2_style))
    story.append(Paragraph(
        "• <b>200+ Company-Specific Question Bank:</b> Mapped to live interview formats of TCS, Infosys, Amazon, etc.<br/>"
        "• <b>Speech Synthesis (Interviewer Voice):</b> Vocalizes questions aloud using HTML5 Web Speech Synthesis API.<br/>"
        "• <b>Speech Recognition (Voice Mic Input):</b> Captures candidate speech via microphone, testing live verbal clarity.<br/>"
        "• <b>10-Point Scorecard Rubric:</b> Evaluates answers on Technical Accuracy (4 pts), Structure (2 pts), STAR Method (2 pts), and Confidence (2 pts), with actionable constructive feedback.",
        bullet_style
    ))

    story.append(Paragraph("4.4 Multilingual Support (9 Indian Languages) & PWA Offline Engine", h2_style))
    story.append(Paragraph(
        "• <b>9 Indian Languages:</b> Full zero-reload DOM localization in English, Hindi, Hinglish, Tamil, Telugu, Kannada, Bengali, Marathi, and Gujarati.<br/>"
        "• <b>PWA Offline Mode:</b> Service worker (sw.js) and manifest (manifest.json) allow full offline installation and usage.<br/>"
        "• <b>1-Click WhatsApp Batch Sharing:</b> Pre-formatted actionable invitation card enabling viral distribution across college batch groups.",
        bullet_style
    ))
    story.append(Spacer(1, 6))

    # 6. MATHEMATICAL SCORING FORMULATION
    story.append(Paragraph("5. Mathematical ATS Match Formulation", h1_style))
    story.append(Paragraph(
        "The match score between candidate resume text and target company profile is calculated using a dual-weighted polynomial:",
        body_style
    ))
    
    math_box = [[
        Paragraph(
            "<b>ATS Compatibility Score Formula:</b><br/>"
            "Score_ATS = [ (Matched_Core_Skills / Total_Core_Skills) x 70% ] + [ (Matched_Bonus_Skills / Total_Bonus_Skills) x 30% ]<br/>"
            "• <b>Score >= 80% (Green Tier):</b> Placement Ready — Strongly aligned for immediate application.<br/>"
            "• <b>Score 60% - 79% (Amber Tier):</b> Competitive with Gaps — Requires 5-10 days targeted upskilling.<br/>"
            "• <b>Score &lt; 60% (Rose Tier):</b> Fundamental Foundations Required — Follow Phase 1 Roadmap.",
            callout_style
        )
    ]]
    math_tbl = Table(math_box, colWidths=[515])
    math_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F0FDF4")),
        ('LINELEFT', (0, 0), (0, -1), 3.5, c_green),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(math_tbl)
    story.append(Spacer(1, 6))

    # 7. CODEBASE & FILE-BY-FILE BREAKDOWN
    story.append(Paragraph("6. Codebase Structure & File Responsibilities", h1_style))
    files_data = [
        [Paragraph("<b>File Path</b>", table_header_style), Paragraph("<b>Module Type</b>", table_header_style), Paragraph("<b>Key Technical Functionality</b>", table_header_style)],
        [Paragraph("<b>index.html</b>", table_cell_bold), Paragraph("SPA Layout", table_cell_style), Paragraph("Single Page Application UI, responsive navigation, modals, and metric counters.", table_cell_style)],
        [Paragraph("<b>css/style.css</b>", table_cell_bold), Paragraph("Design Tokens", table_cell_style), Paragraph("Glassmorphism styles, dark/light theme tokens, keyframe animations, glow effects.", table_cell_style)],
        [Paragraph("<b>js/app.js</b>", table_cell_bold), Paragraph("Master Controller", table_cell_style), Paragraph("Coordinates tab switching, theme toggling, share modals, and Lucide icons.", table_cell_style)],
        [Paragraph("<b>js/gapAnalyzer.js</b>", table_cell_bold), Paragraph("Gap Engine", table_cell_style), Paragraph("Client-side PDF.js parsing, 60+ company skill matcher, dynamic SVG score ring.", table_cell_style)],
        [Paragraph("<b>js/scholarshipEngine.js</b>", table_cell_bold), Paragraph("Scholarship Engine", table_cell_style), Paragraph("6-dimensional filter engine and committee-ready 4-paragraph AI SOP co-pilot.", table_cell_style)],
        [Paragraph("<b>js/mockInterviewer.js</b>", table_cell_bold), Paragraph("Voice Interviewer", table_cell_style), Paragraph("Web Speech API voice synthesis, microphone STT, and 10-point scorecard rubric.", table_cell_style)],
        [Paragraph("<b>js/auth.js</b>", table_cell_bold), Paragraph("Authentication", table_cell_style), Paragraph("Universal document-delegated authentication, session handling, demo student seeds.", table_cell_style)],
        [Paragraph("<b>data/companies.js</b>", table_cell_bold), Paragraph("Dataset", table_cell_style), Paragraph("60+ Indian employers mapped across 5 tiers with core and bonus skill taxonomies.", table_cell_style)],
        [Paragraph("<b>data/scholarships.js</b>", table_cell_bold), Paragraph("Dataset", table_cell_style), Paragraph("25+ verified central, state, and corporate scholarships with eligibility rules.", table_cell_style)],
        [Paragraph("<b>data/translations.js</b>", table_cell_bold), Paragraph("Localization", table_cell_style), Paragraph("Multilingual key-value dictionary for 9 Indian languages.", table_cell_style)],
        [Paragraph("<b>server.js</b>", table_cell_bold), Paragraph("Full-Stack API", table_cell_style), Paragraph("Native Node.js REST API with zero external dependencies and cloud DB sync.", table_cell_style)],
        [Paragraph("<b>sw.js & manifest.json</b>", table_cell_bold), Paragraph("PWA Engine", table_cell_style), Paragraph("Service worker cache-first offline strategy and standalone web app installation.", table_cell_style)],
        [Paragraph("<b>vercel.json</b>", table_cell_bold), Paragraph("Edge Routing", table_cell_style), Paragraph("Static edge routing configuration for zero-downtime production deployment.", table_cell_style)]
    ]
    files_tbl = Table(files_data, colWidths=[115, 95, 305])
    files_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#312E81")),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
    ]))
    story.append(files_tbl)
    story.append(Spacer(1, 8))

    # 8. SOCIAL IMPACT & FUTURE ROADMAP
    story.append(Paragraph("7. Social Impact, NEP 2020 Alignment & Future Roadmap", h1_style))
    story.append(Paragraph(
        "• <b>NEP 2020 Alignment:</b> Directly furthers national educational directives by replacing theoretical career ambiguity with verified industry skill benchmarks and vernacular accessibility.<br/>"
        "• <b>Economic Empowerment:</b> Upgrading a candidate from a service baseline (Rs. 3.5 LPA) to a product/digital tier (Rs. 7.5 LPA) increases lifetime earning potential by over Rs. 25 Lakhs per student.<br/>"
        "• <b>Future Roadmap:</b> Phase 2 (Q4 2026) will introduce a College Placement Officer (TPO) analytics portal and an in-browser DSA code runner. Phase 3 (2027) will add peer-to-peer mock interview rooms.",
        bullet_style
    ))
    story.append(Spacer(1, 10))

    # 9. CERTIFICATION & SIGN-OFF
    signoff_content = [
        [Paragraph("<b>PROJECT CERTIFICATION & ACADEMIC EVALUATION</b>", ParagraphStyle('SignTitle', fontName='Helvetica-Bold', fontSize=9, textColor=c_primary))],
        [Paragraph(
            "This technical report certifies that <b>Margdarshak AI</b> has been fully conceptualized, architected, engineered, and deployed live to production by <b>Mehak</b> as an original technological innovation for the <b>Smart India Hackathon (SIH 2024 Edition)</b>.",
            ParagraphStyle('SignText', fontName='Helvetica', fontSize=8, leading=11, textColor=c_body, spaceAfter=14)
        )],
        [
            Table([
                [
                    Paragraph("<b>Mehak</b><br/><font size=7.5 color='#64748B'>Founder & Lead Developer • Margdarshak AI<br/>SIH 2024 Edition</font>", ParagraphStyle('Sign1', fontName='Helvetica', fontSize=8.5, leading=11)),
                    Paragraph("<b>Faculty / Mentor Signature</b><br/><font size=7.5 color='#64748B'>Academic Project Evaluator / SIH Committee<br/>Institution / Department of Computer Science</font>", ParagraphStyle('Sign2', fontName='Helvetica', fontSize=8.5, leading=11))
                ]
            ], colWidths=[240, 260], style=[
                ('LINEABOVE', (0, 0), (-1, -1), 0.8, colors.HexColor("#94A3B8")),
                ('TOPPADDING', (0, 0), (-1, -1), 5),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ])
        ]
    ]
    signoff_tbl = Table(signoff_content, colWidths=[515])
    signoff_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(KeepTogether(signoff_tbl))

    # BUILD DOCUMENT
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SUCCESS: Generated PDF at {PDF_OUTPUT_PATH}")

if __name__ == "__main__":
    build_pdf()
