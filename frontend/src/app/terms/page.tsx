import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div>
        <Link href="/" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-4">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mt-1">Last updated: March 24, 2026</p>
      </div>

      <div className="prose prose-sm prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By accessing and using the HiringAI platform (&quot;Service&quot;), you agree to be bound by these Terms and Conditions.
            If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. Description of Service</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            HiringAI provides an AI-powered hiring pipeline that includes resume screening, candidate scoring,
            automated voice interviews, and a results dashboard. The Service uses artificial intelligence
            technologies including Claude AI for resume analysis and Vapi for voice call infrastructure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. User Accounts</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When you submit an application through our platform, you agree to provide accurate, current,
            and complete information. You are responsible for maintaining the confidentiality of any
            account credentials provided to you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Resume Submission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By uploading your resume, you grant HiringAI permission to process, analyze, and store your
            resume data for the purpose of evaluating your candidacy. Resumes are processed using AI
            technology and scored against the provided job description.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. AI Voice Interviews</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Candidates who meet the screening threshold may receive an automated voice interview call.
            By providing your phone number and scheduling an interview, you consent to receiving this
            automated call at the scheduled time. Interviews are recorded and analyzed by AI for scoring purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. Fair Use & Non-Discrimination</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our AI scoring system is designed to be fair and objective. We do not penalize candidates for
            employment gaps, non-traditional educational backgrounds, or other factors unrelated to job
            qualifications. Scoring is based solely on relevant experience, skills match, education fit,
            and career trajectory.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. Limitation of Liability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Service is provided &quot;as is&quot; without warranties of any kind. HiringAI shall not be liable
            for any indirect, incidental, special, or consequential damages arising from your use of the Service.
            AI-generated scores and recommendations are advisory and do not constitute a guarantee of employment.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">8. Changes to Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We reserve the right to modify these terms at any time. Changes will be effective immediately
            upon posting. Your continued use of the Service constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">9. Contact</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For questions about these terms, please contact us at legal@hiringai.example.com.
          </p>
        </section>
      </div>
    </div>
  );
}
