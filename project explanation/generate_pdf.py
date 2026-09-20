# -*- coding: utf-8 -*-
"""
Margdarshak AI - Illustrated Executive Technical Report PDF Generator (Tight 4-Page Layout)
Includes High-Resolution Diagrams, Architectural Flowcharts & In-Depth System Breakdown
Created for Founder Mehak | Smart India Hackathon (SIH 2024 Edition)
"""

import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    KeepTogether, HRFlowable, Image, PageBreak
)
from reportlab.pdfgen import canvas

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIAGRAMS_DIR = os.path.join(BASE_DIR, "diagrams")
PDF_OUTPUT_PATH = os.path.join(BASE_DIR, "Margdarshak AI report.pdf")

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
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 814, "Margdarshak AI — Comprehensive Technical Project & System Architecture Report")
            self.drawRightString(A4[0] - 36, 814, "Created by Mehak | SIH 2024 Edition")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(36, 808, A4[0] - 36, 808)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 32, A4[0] - 36, 32)
        
        footer_text_left = "Margdarshak AI • Live Platform: margdarshak-ai-khaki.vercel.app"
        self.drawString(36, 22, footer_text_left)
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 36, 22, page_str)
        self.restoreState()

def build_pdf():
    doc = SimpleDocTemplate(
        PDF_OUTPUT_PATH,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Colors
    c_primary = colors.HexColor("#312E81")     # Indigo-900
    c_accent = colors.HexColor("#4F46E5")      # Indigo-600
    c_dark = colors.HexColor("#0F172A")        # Slate-900
    c_body = colors.HexColor("#334155")        # Slate-700
    c_light_bg = colors.HexColor("#F8FAFC")    # Slate-50
    c_border = colors.HexColor("#CBD5E1")      # Slate-300
    c_green = colors.HexColor("#10B981")       # Emerald-500

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=23,
        textColor=colors.white,
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor("#E0E7FF"),
        spaceAfter=6
    )

    meta_style = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.white
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=13.5,
        textColor=c_primary,
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11.5,
        textColor=c_accent,
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_body,
        spaceAfter=3.5,
        alignment=4 # Justified
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=c_body,
        leftIndent=11,
        firstLineIndent=-7,
        spaceAfter=2
    )

    caption_style = ParagraphStyle(
        'Caption_Style',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#64748B"),
        alignment=1, # Center
        spaceBefore=2,
        spaceAfter=5
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=c_dark
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=c_dark
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=9,
        textColor=c_primary
    )

    story = []

    # =============================================================
    # PAGE 1: HEADER BANNER, EXECUTIVE SUMMARY, ARCHITECTURE
    # =============================================================
    header_content = [
        [Paragraph("<b>SMART INDIA HACKATHON (SIH 2024 EDITION) • OFFICIAL TECHNICAL REPORT</b>", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=7, textColor=colors.HexColor("#FEF08A"), spaceAfter=2))],
        [Paragraph("MARGDARSHAK AI (मार्गदर्शक AI)", title_style)],
        [Paragraph('"From Classroom to Dream Career — Guided by AI"', subtitle_style)],
        [HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#818CF8"), spaceBefore=0, spaceAfter=5)],
        [
            Table([
                [
                    Paragraph("<b>Founder & Lead Developer:</b> Mehak", meta_style),
                    Paragraph("<b>Live Platform:</b> margdarshak-ai-khaki.vercel.app", meta_style)
                ],
                [
                    Paragraph("<b>Edition & Track:</b> SIH 2024 Edition", meta_style),
                    Paragraph("<b>GitHub Source:</b> github.com/Mehak237/margdarshak-ai", meta_style)
                ]
            ], colWidths=[245, 275], style=[
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
                ('TOPPADDING', (0, 0), (-1, -1), 1),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ])
        ]
    ]

    header_table = Table(header_content, colWidths=[523])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#312E81")),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("1. Executive Summary & Ground Realities", h1_style))
    story.append(Paragraph(
        "Over <b>1.5 million engineers and degree students graduate in India every year</b>. Yet, national employability studies (including the Wheebox India Skills Report) reveal that <b>less than 45% of students from Tier-2 and Tier-3 institutions</b> possess job-ready technical, algorithmic, and conversational proficiencies. This deficit stems from an acute <b>information, guidance, and economic divide</b>: students submit generic resumes lacking company ATS keywords, miss out on thousands of crores in available scholarships, and cannot afford commercial coaching.",
        body_style
    ))

    callout_data = [[
        Paragraph(
            "<b>The Core Innovation:</b> Architected and engineered by <b>Mehak</b> for SIH 2024, <b>Margdarshak AI</b> is an all-in-one, zero-cost, browser-based career accelerator. It combines client-side NLP heuristics with Google Gemini 1.5 Flash to provide instant <b>Resume vs. Dream Job Gap Analysis across 60+ Indian employers</b>, <b>25+ verified scholarships</b> with an AI Statement of Purpose (SOP) writer, <b>real-time interactive voice mock interviews</b>, and <b>9 Indian languages</b>.",
            callout_style
        )
    ]]
    callout_tbl = Table(callout_data, colWidths=[523])
    callout_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EEF2FF")),
        ('LINELEFT', (0, 0), (0, -1), 3, colors.HexColor("#4F46E5")),
        ('LEFTPADDING', (0, 0), (-1, -1), 9),
        ('RIGHTPADDING', (0, 0), (-1, -1), 9),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(callout_tbl)
    story.append(Spacer(1, 5))

    story.append(Paragraph("2. Full-Stack Hybrid Architecture & Data Flow", h1_style))
    story.append(Paragraph(
        "Margdarshak AI uses a <b>Client-First Hybrid Edge Architecture</b>. Browser APIs execute 100% of operations client-side—guaranteeing <b>0ms cold starts</b>, total candidate privacy (PDFs never leave local memory), and zero hosting expenses—while allowing seamless cloud sync with Google Gemini and multi-user databases.",
        body_style
    ))

    arch_img_path = os.path.join(DIAGRAMS_DIR, "diagram_architecture.png")
    if os.path.exists(arch_img_path):
        story.append(Image(arch_img_path, width=490, height=230))
        story.append(Paragraph("Figure 1: Full-Stack Hybrid Architecture — Client-First SPA + Progressive Cloud AI", caption_style))

    story.append(PageBreak())

    # =============================================================
    # PAGE 2: RESUME GAP PIPELINE & SCHOLARSHIP WORKFLOW
    # =============================================================
    story.append(Paragraph("3. Feature Deep Dive: Resume vs. Dream Job Gap Analyzer", h1_style))
    story.append(Paragraph(
        "The Gap Analyzer bridges the gap between candidate resumes and real-world hiring criteria. It features an integrated database of <b>60+ premier employers in India</b> (Google, Amazon, TCS Ninja/Digital, Infosys DSE, Wipro, Flipkart, Swiggy, Goldman Sachs) categorized into 5 competitive tiers.",
        body_style
    ))

    resume_img_path = os.path.join(DIAGRAMS_DIR, "diagram_resume_pipeline.png")
    if os.path.exists(resume_img_path):
        story.append(Image(resume_img_path, width=490, height=170))
        story.append(Paragraph("Figure 2: Resume Gap Analysis Data Pipeline — From Input to 15-Day Action Roadmap", caption_style))

    story.append(Paragraph(
        "• <b>Client-Side Text Extraction:</b> Uses an embedded `PDF.js` worker to parse uploaded resumes locally without server upload latency or privacy concerns.<br/>"
        "• <b>Weighted Dual-Tier ATS Formula:</b> Mathematically weights <b>Core Must-Have Skills (70%)</b> vs. <b>Bonus Edge Skills (30%)</b>.<br/>"
        "• <b>Animated SVG Radial Score Ring:</b> Calculates exact SVG `stroke-dashoffset` to smoothly animate student readiness from 0% to 100%.<br/>"
        "• <b>15-Day Personalized Roadmap:</b> Automatically generated 3-phase curriculum: Days 1-5 (Fundamentals & Missing Core Skills), Days 6-10 (Applied Portfolio Project), Days 11-15 (Mock Questions & System Design Prep).<br/>"
        "• <b>Elevator Pitch Evaluator:</b> NLP diagnostic for candidate's 60-second 'Tell Me About Yourself' opening pitch.",
        bullet_style
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("4. Feature Deep Dive: Smart Scholarship Engine & AI SOP Co-Pilot", h1_style))
    story.append(Paragraph(
        "Over <b>Rs. 2,000 Crores</b> in scholarship funds go uncollected annually because students lack discoverability or struggle to draft high-stakes essays. Margdarshak AI solves both problems simultaneously.",
        body_style
    ))

    scholar_img_path = os.path.join(DIAGRAMS_DIR, "diagram_scholarship_matrix.png")
    if os.path.exists(scholar_img_path):
        story.append(Image(scholar_img_path, width=490, height=170))
        story.append(Paragraph("Figure 3: Smart Scholarship Multi-Factor Filter & AI Statement of Purpose Co-Pilot Workflow", caption_style))

    story.append(Paragraph(
        "• <b>25+ Verified Indian Schemes:</b> Real schemes including AICTE Pragati for Girls (Rs. 50,000/yr), Reliance Foundation (Rs. 2,00,000), Tata Trust Medical & Engineering Grants, NSP Central Sector, and Post-Matric SC/ST/OBC.<br/>"
        "• <b>6-Dimensional Real-Time Filter:</b> Evaluates family income thresholds, academic percentages (40-98% slider), social categories (General/OBC/SC/ST/EWS), gender, state domicile, and degree level.<br/>"
        "• <b>Committee-Ready 4-Paragraph SOP Writer:</b> Auto-generates eloquent Statements of Purpose articulating academic passion, financial need, technical vision, and societal dedication.",
        bullet_style
    ))

    story.append(PageBreak())

    # =============================================================
    # PAGE 3: VOICE AI MOCK INTERVIEWER & FILE STRUCTURE
    # =============================================================
    story.append(Paragraph("5. Feature Deep Dive: Voice AI Mock Interviewer with Live Scorecard", h1_style))
    story.append(Paragraph(
        "Commercial coaching platforms charge Rs. 1,500 - Rs. 3,000 per mock session. Margdarshak AI delivers an interactive, voice-driven mock interview simulator 100% free right in the browser.",
        body_style
    ))

    mock_img_path = os.path.join(DIAGRAMS_DIR, "diagram_mock_voice.png")
    if os.path.exists(mock_img_path):
        story.append(Image(mock_img_path, width=490, height=170))
        story.append(Paragraph("Figure 4: Bi-Directional Speech Synthesis (TTS) & Speech Recognition (STT) Interview Pipeline", caption_style))

    story.append(Paragraph(
        "• <b>Speech Synthesis (Voice Interviewer):</b> Vocalizes company-tailored interview questions using the HTML5 `SpeechSynthesisUtterance` API.<br/>"
        "• <b>Speech-to-Text Recognition:</b> Listens to candidate answers via the browser microphone using `webkitSpeechRecognition`, transcribing speech into structured text.<br/>"
        "• <b>10-Point Scorecard Rubric:</b> Evaluates answers across Technical Accuracy (4 pts), Clarity & Structure (2 pts), STAR Method Compliance (2 pts), and Delivery Confidence (2 pts), accompanied by actionable constructive improvement pointers.",
        bullet_style
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("6. Codebase Architecture & File Responsibilities", h1_style))
    story.append(Paragraph(
        "The project is structured with modular separation of concerns across single-page presentation, specialized JavaScript calculation engines, normalized datasets, and edge configurations.",
        body_style
    ))

    file_img_path = os.path.join(DIAGRAMS_DIR, "diagram_file_structure.png")
    if os.path.exists(file_img_path):
        story.append(Image(file_img_path, width=490, height=225))
        story.append(Paragraph("Figure 5: Visual Codebase Architecture & Modular File Responsibilities", caption_style))

    story.append(PageBreak())

    # =============================================================
    # PAGE 4: CODE TABLE, MATHEMATICAL SCORING, IMPACT & CERTIFICATION
    # =============================================================
    story.append(Paragraph("7. Codebase Directory Inventory & Mathematical Model", h1_style))

    files_data = [
        [Paragraph("<b>File / Path</b>", table_header_style), Paragraph("<b>Module Role</b>", table_header_style), Paragraph("<b>Key Technical Functionality</b>", table_header_style)],
        [Paragraph("<b>index.html</b>", table_cell_bold), Paragraph("SPA Markup", table_cell_style), Paragraph("Full semantic single-page application UI, modular sections, navigation, and modals.", table_cell_style)],
        [Paragraph("<b>css/style.css</b>", table_cell_bold), Paragraph("Styles & Theme", table_cell_style), Paragraph("Custom dark/light glassmorphism design tokens, keyframe animations, and responsive utilities.", table_cell_style)],
        [Paragraph("<b>js/app.js</b>", table_cell_bold), Paragraph("Master Controller", table_cell_style), Paragraph("Client-side routing, tab coordination, theme switcher, and WhatsApp share handler.", table_cell_style)],
        [Paragraph("<b>js/gapAnalyzer.js</b>", table_cell_bold), Paragraph("Gap Engine", table_cell_style), Paragraph("Resume text extraction (PDF.js), 60+ company gap matcher, and 15-day roadmap builder.", table_cell_style)],
        [Paragraph("<b>js/scholarshipEngine.js</b>", table_cell_bold), Paragraph("Scholarship Engine", table_cell_style), Paragraph("Multi-factor scholarship query engine and committee-ready 4-paragraph AI SOP writer.", table_cell_style)],
        [Paragraph("<b>js/mockInterviewer.js</b>", table_cell_bold), Paragraph("Voice Interviewer", table_cell_style), Paragraph("Web Speech API voice synthesis, microphone STT, and 10-point scorecard rubric.", table_cell_style)],
        [Paragraph("<b>js/auth.js</b>", table_cell_bold), Paragraph("Auth Controller", table_cell_style), Paragraph("Universal document-delegated authentication, session management, and demo seeds.", table_cell_style)],
        [Paragraph("<b>data/companies.js</b>", table_cell_bold), Paragraph("Dataset", table_cell_style), Paragraph("60+ curated Indian tech companies with core & bonus skill definitions.", table_cell_style)],
        [Paragraph("<b>data/scholarships.js</b>", table_cell_bold), Paragraph("Dataset", table_cell_style), Paragraph("25+ verified Indian scholarships with live application links and eligibility rules.", table_cell_style)],
        [Paragraph("<b>data/translations.js</b>", table_cell_bold), Paragraph("Dataset", table_cell_style), Paragraph("Multilingual dictionary for 9 Indian languages (English, Hindi, Hinglish, etc.).", table_cell_style)],
        [Paragraph("<b>server.js</b>", table_cell_bold), Paragraph("Backend API", table_cell_style), Paragraph("Native Node.js REST API with cloud database support and Gemini proxy.", table_cell_style)],
        [Paragraph("<b>sw.js & manifest.json</b>", table_cell_bold), Paragraph("PWA Engine", table_cell_style), Paragraph("Service worker offline cache and web app installation manifest.", table_cell_style)],
        [Paragraph("<b>vercel.json</b>", table_cell_bold), Paragraph("Cloud Config", table_cell_style), Paragraph("Static edge routing and cloud production deployment configuration.", table_cell_style)]
    ]
    files_tbl = Table(files_data, colWidths=[110, 95, 318])
    files_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#312E81")),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
    ]))
    story.append(files_tbl)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Mathematical ATS Scoring Formulation:", h2_style))
    math_box = [[
        Paragraph(
            "<b>ATS Compatibility Score Formula:</b><br/>"
            "Score_ATS = [ (Matched_Core_Skills / Total_Core_Skills) x 70% ] + [ (Matched_Bonus_Skills / Total_Bonus_Skills) x 30% ]<br/>"
            "• <b>Score >= 80% (Green Tier):</b> Ready for Selection — Strongly aligned; ready to apply immediately.<br/>"
            "• <b>Score 60% - 79% (Amber Tier):</b> Competitive with Gaps — Needs 5-10 days targeted gap closure using roadmap.<br/>"
            "• <b>Score &lt; 60% (Rose Tier):</b> Fundamental Foundations Required — Complete Phase 1 core curriculum.",
            callout_style
        )
    ]]
    math_tbl = Table(math_box, colWidths=[523])
    math_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F0FDF4")),
        ('LINELEFT', (0, 0), (0, -1), 3, c_green),
        ('LEFTPADDING', (0, 0), (-1, -1), 9),
        ('RIGHTPADDING', (0, 0), (-1, -1), 9),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(math_tbl)
    story.append(Spacer(1, 6))

    story.append(Paragraph("8. Social Impact, NEP 2020 Alignment & Project Sign-Off", h1_style))
    story.append(Paragraph(
        "• <b>Viksit Bharat 2047 & NEP 2020:</b> Democratizes high-tier placement coaching for 10M+ Indian students in rural and non-metro colleges, breaking linguistic and economic barriers.<br/>"
        "• <b>Economic ROI:</b> Elevating a candidate from service baseline (Rs. 3.5 LPA) to a product/digital tier (Rs. 7.5 LPA) unlocks over <b>Rs. 25 Lakhs</b> in incremental lifetime earnings.<br/>"
        "• <b>Women in Tech Empowerment:</b> Actively flags high-value female schemes (AICTE Pragati) to boost gender equity in engineering.",
        bullet_style
    ))
    story.append(Spacer(1, 8))

    # Certification Block
    signoff_content = [
        [Paragraph("<b>PROJECT CERTIFICATION & MENTOR EVALUATION</b>", ParagraphStyle('SignTitle', fontName='Helvetica-Bold', fontSize=8, textColor=c_primary))],
        [Paragraph(
            "This technical report certifies that <b>Margdarshak AI</b> has been conceptualized, architected, engineered, and deployed live to production by <b>Mehak</b> as an original technological innovation for the <b>Smart India Hackathon (SIH 2024 Edition)</b>.",
            ParagraphStyle('SignText', fontName='Helvetica', fontSize=7, leading=9.5, textColor=c_body, spaceAfter=10)
        )],
        [
            Table([
                [
                    Paragraph("<b>Mehak</b><br/><font size=6.5 color='#64748B'>Founder & Lead Developer • Margdarshak AI<br/>SIH 2024 Edition</font>", ParagraphStyle('Sign1', fontName='Helvetica', fontSize=7.5, leading=9)),
                    Paragraph("<b>Faculty / Mentor Signature</b><br/><font size=6.5 color='#64748B'>Academic Project Evaluator / SIH Committee<br/>Department of Computer Science & Engineering</font>", ParagraphStyle('Sign2', fontName='Helvetica', fontSize=7.5, leading=9))
                ]
            ], colWidths=[245, 275], style=[
                ('LINEABOVE', (0, 0), (-1, -1), 0.8, colors.HexColor("#94A3B8")),
                ('TOPPADDING', (0, 0), (-1, -1), 3),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ])
        ]
    ]
    signoff_tbl = Table(signoff_content, colWidths=[523])
    signoff_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(KeepTogether(signoff_tbl))

    # BUILD DOCUMENT
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SUCCESS: Generated illustrated 4-page PDF at {PDF_OUTPUT_PATH}")

if __name__ == "__main__":
    build_pdf()
