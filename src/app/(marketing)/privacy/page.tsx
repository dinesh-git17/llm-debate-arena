// src/app/(marketing)/privacy/page.tsx
import Link from 'next/link'

import { Container } from '@/components/ui/container'
import { Divider } from '@/components/ui/divider'
import { Prose } from '@/components/ui/prose'
import { Section } from '@/components/ui/section'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Debate Lab collects, uses, and protects your personal information and debate data.',
  openGraph: {
    title: 'Privacy Policy | Debate Lab',
    description: 'How we handle your data and protect your privacy.',
  },
}

const LAST_UPDATED = 'November 28, 2025'

export default function PrivacyPage() {
  return (
    <>
      <Section>
        <Container>
          <header className="pt-8 md:pt-12 mb-12 max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-muted-foreground">Last updated: {LAST_UPDATED}</p>
          </header>

          <div className="max-w-3xl mx-auto">
            <article>
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  Introduction
                </h2>
                <Prose>
                  <p>
                    Welcome to Debate Lab. We are committed to protecting your privacy and ensuring
                    transparency about how we handle your data. This Privacy Policy explains what
                    information we collect, how we use it, and your rights regarding your personal
                    data.
                  </p>
                  <p>
                    Debate Lab is a platform where AI models engage in structured debates on topics
                    you choose. By using our service, you agree to the collection and use of
                    information in accordance with this policy.
                  </p>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="information-we-collect" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  Information We Collect
                </h2>
                <Prose>
                  <h3>Information You Provide</h3>
                  <ul>
                    <li>Debate topics and custom rules you submit</li>
                    <li>Configuration preferences (number of turns, debate format)</li>
                    <li>Feedback and communications you send to us</li>
                  </ul>

                  <h3>Information Collected Automatically</h3>
                  <ul>
                    <li>Device information (browser type, operating system)</li>
                    <li>IP address and approximate location</li>
                    <li>Usage data (pages visited, features used, time spent)</li>
                    <li>Session identifiers</li>
                  </ul>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="how-we-use-information" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  How We Use Your Information
                </h2>
                <Prose>
                  <p>We use the information we collect to:</p>
                  <ul>
                    <li>Provide and operate the Debate Lab service</li>
                    <li>Generate AI debates based on your submitted topics</li>
                    <li>Improve and optimize our platform</li>
                    <li>Monitor for abuse and ensure platform security</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                    <li>Respond to your inquiries and support requests</li>
                  </ul>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="ai-data-handling" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  AI & LLM Data Handling
                </h2>
                <Prose>
                  <p>
                    Debate Lab uses third-party AI language models to generate debate content.
                    Here&apos;s how your data is handled in this context:
                  </p>
                  <ul>
                    <li>Debate topics you submit are sent to AI providers to generate responses</li>
                    <li>We do not use your debate content to train AI models</li>
                    <li>AI-generated content is stored temporarily for your session</li>
                    <li>Shared debates may be stored longer based on your sharing preferences</li>
                    <li>We implement content filtering to prevent misuse</li>
                  </ul>
                  <p>
                    AI providers we use include OpenAI, Anthropic, and xAI. Each provider has their
                    own privacy policies governing how they handle data sent to their APIs.
                  </p>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="data-storage-security" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  Data Storage & Security
                </h2>
                <Prose>
                  <p>
                    We take the security of your data seriously and implement appropriate technical
                    and organizational measures including:
                  </p>
                  <ul>
                    <li>Encryption of data in transit (TLS/HTTPS)</li>
                    <li>Secure cloud infrastructure with industry-standard protections</li>
                    <li>Regular security assessments and monitoring</li>
                    <li>Access controls limiting who can view your data</li>
                    <li>Rate limiting and abuse prevention systems</li>
                  </ul>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="third-party-services" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  Third-Party Services
                </h2>
                <Prose>
                  <p>We use the following third-party services to operate Debate Lab:</p>
                  <ul>
                    <li>
                      <strong>OpenAI</strong> — Provides GPT models for debate generation
                    </li>
                    <li>
                      <strong>Anthropic</strong> — Provides Claude for moderation and judging
                    </li>
                    <li>
                      <strong>xAI</strong> — Provides Grok models for debate generation
                    </li>
                    <li>
                      <strong>Vercel</strong> — Hosting and infrastructure
                    </li>
                  </ul>
                  <p>
                    Each of these services has their own privacy policy. We encourage you to review
                    their policies to understand how they handle data.
                  </p>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="cookies-tracking" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  Cookies & Tracking
                </h2>
                <Prose>
                  <p>We use cookies and similar technologies for:</p>
                  <ul>
                    <li>
                      <strong>Essential cookies</strong> — Required for the service to function
                      (session management, security)
                    </li>
                    <li>
                      <strong>Preference cookies</strong> — Remember your settings (theme
                      preference)
                    </li>
                    <li>
                      <strong>Analytics cookies</strong> — Help us understand how you use the
                      service (anonymized usage data)
                    </li>
                  </ul>
                  <p>
                    You can control cookie preferences through your browser settings. Disabling
                    certain cookies may affect functionality.
                  </p>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="your-rights" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  Your Rights
                </h2>
                <Prose>
                  <p>
                    Depending on your location, you may have the following rights regarding your
                    personal data:
                  </p>
                  <ul>
                    <li>
                      <strong>Access</strong> — Request a copy of the data we hold about you
                    </li>
                    <li>
                      <strong>Correction</strong> — Request correction of inaccurate data
                    </li>
                    <li>
                      <strong>Deletion</strong> — Request deletion of your personal data
                    </li>
                    <li>
                      <strong>Portability</strong> — Request a portable copy of your data
                    </li>
                    <li>
                      <strong>Objection</strong> — Object to certain processing of your data
                    </li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us using the information
                    provided in the Contact section below.
                  </p>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="data-retention" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  Data Retention
                </h2>
                <Prose>
                  <p>We retain your data for the following periods:</p>
                  <ul>
                    <li>
                      <strong>Session data</strong> — Deleted when your session ends or within 24
                      hours of inactivity
                    </li>
                    <li>
                      <strong>Debate transcripts</strong> — Retained for up to 30 days unless you
                      share them
                    </li>
                    <li>
                      <strong>Shared debates</strong> — Retained until expiration (24 hours to 1
                      week based on your selection)
                    </li>
                    <li>
                      <strong>Usage analytics</strong> — Aggregated data retained for up to 12
                      months
                    </li>
                  </ul>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="childrens-privacy" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  Children&apos;s Privacy
                </h2>
                <Prose>
                  <p>
                    Debate Lab is not intended for use by children under the age of 13. We do not
                    knowingly collect personal information from children under 13. If you are a
                    parent or guardian and believe your child has provided us with personal
                    information, please contact us immediately.
                  </p>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="policy-changes" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  Changes to This Policy
                </h2>
                <Prose>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any
                    material changes by posting the new policy on this page and updating the
                    &quot;Last updated&quot; date. We encourage you to review this policy
                    periodically for any changes.
                  </p>
                </Prose>
              </section>

              <Divider className="my-12" />

              <section id="contact" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                  Contact Us
                </h2>
                <Prose>
                  <p>
                    If you have any questions about this Privacy Policy or our data practices,
                    please contact us:
                  </p>
                  <ul>
                    <li>
                      <strong>Email:</strong>{' '}
                      <a
                        href="mailto:privacy@debatelab.ai"
                        className="text-primary hover:underline"
                      >
                        privacy@debatelab.ai
                      </a>
                    </li>
                  </ul>
                </Prose>
              </section>

              <Divider className="my-12" />

              <footer className="text-sm text-muted-foreground">
                <p>
                  See also:{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </footer>
            </article>
          </div>
        </Container>
      </Section>
    </>
  )
}
