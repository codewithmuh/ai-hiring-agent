import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div>
        <Link href="/" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-1">Last updated: March 24, 2026</p>
      </div>

      <div className="prose prose-sm prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold">1. Information We Collect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect information you provide directly when using HiringAI, including:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
            <li>Personal information (name, email address, phone number)</li>
            <li>Resume/CV documents and their contents</li>
            <li>Voice interview recordings and transcripts</li>
            <li>Scheduling preferences and selected time slots</li>
            <li>Usage data and interaction logs with the platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">We use collected information to:</p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
            <li>Screen and score resumes against job descriptions using AI</li>
            <li>Conduct automated voice interviews at scheduled times</li>
            <li>Analyze interview transcripts and generate candidate assessments</li>
            <li>Display candidate information on the hiring dashboard</li>
            <li>Send interview reminders and notifications</li>
            <li>Improve our AI models and service quality</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. AI Processing</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your resume and interview data are processed by third-party AI services, including Anthropic&apos;s
            Claude AI for text analysis, Vapi for voice call management, and ElevenLabs for text-to-speech.
            These services process your data in accordance with their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Data Storage & Security</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your data is stored in a PostgreSQL database and secured using industry-standard practices.
            Resume files are stored securely on our servers. We implement appropriate technical and
            organizational measures to protect your personal data against unauthorized access, alteration,
            or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Data Retention</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We retain your personal data for as long as necessary to fulfill the purposes for which it
            was collected, including to satisfy any legal, accounting, or reporting requirements.
            Candidate data is typically retained for 12 months after the application date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. Your Rights</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">You have the right to:</p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
            <li>Access your personal data held by us</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to AI-based automated decision-making</li>
            <li>Request a human review of any AI-generated assessment</li>
            <li>Withdraw consent for data processing at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. Third-Party Services</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use the following third-party services that may process your data:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
            <li><strong>Anthropic (Claude AI)</strong> — Resume analysis and transcript scoring</li>
            <li><strong>Vapi</strong> — Voice call infrastructure and management</li>
            <li><strong>ElevenLabs</strong> — Text-to-speech for AI interviewer voice</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">8. Cookies</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use essential cookies to ensure the proper functioning of our platform. We do not use
            tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">9. Contact</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For privacy-related inquiries or to exercise your rights, contact our Data Protection Officer
            at privacy@hiringai.example.com.
          </p>
        </section>
      </div>
    </div>
  );
}
