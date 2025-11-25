import Header from '@/components/shared/Header';
import { LandingPrimaryTextCtaSection } from '@/components/landing/cta/LandingPrimaryCta';
import { LandingSocialProof } from '@/components/landing/social-proof/LandingSocialProof';
import { LandingTestimonialGrid } from '@/components/landing/testimonial/LandingTestimonialGrid';
import { LandingBandSection } from '@/components/landing/LandingBand';
import { LandingTestimonialReadMoreWrapper } from '@/components/landing/testimonial/LandingTestimonialReadMoreWrapper';
import { LandingFaqCollapsibleSection } from '@/components/landing/LandingFaqCollapsible';
import { Button } from '@/components/shared/ui/button';
import HomeList from '@/components/blog/HomeList';
import stats from '@/data/stats';
import { metadata } from '@/data/config/metadata';
// import { BundleShowcase } from '@/components/showcase/BundleShowcase';
import Link from 'next/link';
import { LandingWavesCtaBg } from '@/components/landing/cta-backgrounds/LandingWavesCtaBg';

const avatars = [
  {
    imageSrc: '/static/images/people/13.png',
    name: 'Daniel Nguyen',
  },
  {
    imageSrc: '/static/images/people/1.png',
    name: 'Matthias',
  },
  {
    imageSrc: '/static/images/people/2.jpeg',
    name: 'Tropiano',
  },
  {
    imageSrc: '/static/images/people/4.jpeg',
    name: 'Catalin',
  },
  {
    imageSrc: '/static/images/people/14.png',
    name: 'Fekri',
  },
  {
    imageSrc: '/static/images/people/15.jpeg',
    name: 'Serg',
  },
];

export default async function Home() {
  const users = stats.contributors || 0;

  return (
    <div className="flex flex-col w-full items-center">
      <Header className="mb-0 lg:mb-0" />
      <LandingPrimaryTextCtaSection
        title="Rare Deals and Discounts"
        descriptionComponent={
          <p className="text-sm md:text-base max-w-3xl">
            Limited time deals on the best <strong>iOS Apps</strong>,{' '}
            <strong>Mac Apps</strong>, <strong>SaaS</strong>,{' '}
            <strong>AI</strong> and <strong>Web Apps</strong>. <br />
            Save big with discounts for Black Friday, Cyber Monday & more!
          </p>
        }
        textPosition="center"
        className="relative bg-gradient-to-b from-gray-200/60 to-transparent dark:from-gray-900 dark:to-transparent !pb-6"
        effectComponent={<LandingWavesCtaBg />}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              size="xl"
              variant="primary"
              asChild
              className="backdrop-blur-[2px] bg-primary-600/30 dark:bg-primary-500/30"
            >
              <Link href="/handpicked-deals">All Deals</Link>
            </Button>

            <Button
              size="xl"
              className="backdrop-blur-[2px] bg-white/30 dark:bg-black/40 border-2 border-gray-500/10"
            >
              <Link href="/categories/developer-tools">All Categories</Link>
            </Button>
          </div>

          <div className="flex items-center">
            <a
              href="https://github.com/danmindru/rare-big-deal/graphs/contributors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LandingSocialProof
                className="w-full mt-12"
                showRating
                numberOfUsers={users}
                suffixText="makers"
                avatarItems={avatars}
              />
            </a>
          </div>
        </div>
      </LandingPrimaryTextCtaSection>

      {/* <BundleShowcase className="mt-8" /> */}

      <section className="max-w-2xl 2xl:max-w-6xl w-full mt-2 p-6">
        <HomeList />
      </section>

      <LandingBandSection
        title="Stars! Stars everywhere!"
        descriptionComponent={
          <div className="flex flex-col">
            <p className="text-lg mt-4">
              People love Rare Big Deal! <br />
              There's no better place to post & find a deal.
            </p>

            <a
              href="https://github.com/danmindru/rare-big-deal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="GitHub Repo stars"
                src="https://img.shields.io/github/stars/danmindru/rare-big-deal"
                className="mt-4 h-6 w-auto"
              />
            </a>
          </div>
        }
        supportingComponent={
          <LandingSocialProof
            className="w-full mt-12"
            showRating
            numberOfUsers={users}
            suffixText="makers"
            avatarItems={avatars}
          />
        }
      />

      <LandingTestimonialReadMoreWrapper size="md">
        <LandingTestimonialGrid
          title="Hear It from Our Users"
          description="Discover what our happy customers have to say about their experience with Rare Big Deal:"
          testimonialItems={[
             {
              name: 'Matthias Neumayer',
              text: 'Love this!',
              handle: '@matthiasneumayer',
              imageSrc: '/static/images/people/32.jpg',
              url: 'https://www.linkedin.com/feed/update/urn:li:activity:7393563664001421312?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7393563664001421312%2C7393564140943925249%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287393564140943925249%2Curn%3Ali%3Aactivity%3A7393563664001421312%29',
             },

             {
              name: 'Nikki S',
              text: 'Very cool – great idea! 💡',
              handle: '@nikkis',
              imageSrc: '/static/images/people/31.jpg',
              url: 'https://www.linkedin.com/feed/update/urn:li:activity:7393563664001421312?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7393563664001421312%2C7393569656852336640%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287393569656852336640%2Curn%3Ali%3Aactivity%3A7393563664001421312%29',
            },

            {
              name: 'Wooyeong Kim',
              text: 'Very cool! Immediately submitted :)',
              handle: '@wooing0306',
              imageSrc: '/static/images/people/30.jpg',
              url: 'https://x.com/wooing0306/status/1986758537893347580',
            },

            {
              name: 'Csaba Kissi',
              text: 'Nice work!',
              handle: '@csaba.bsky.social',
              imageSrc: '/static/images/people/22.jpg',
              url: 'https://bsky.app/profile/csaba.bsky.social/post/3lbfwvsk4us2c',
            },

            {
              name: 'Isaac',
              text: '[...] the site is awesome [...]',
              handle: '@IMadeAGlitch',
              imageSrc: '/static/images/people/21.jpg',
              url: 'https://x.com/IMadeAGlitch/status/1858975664025817236',
            },

            {
              name: 'AP',
              text: 'Great work 💪',
              handle: '@anhphong_dev',
              imageSrc: '/static/images/people/18.jpg',
              url: 'https://x.com/anhphong_dev/status/1859277954091712711',
            },
            {
              name: 'Sam',
              text: 'Thats a great list of discounts. Super helpful.',
              handle: '@sambruce23',
              imageSrc: '/static/images/people/19.webp',
              url: 'https://www.reddit.com/r/SaaS/comments/1gucxgx/comment/lxu9y37/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button',
              featured: true,
            },
            {
              name: 'Adam R.',
              text: 'Oh great idea [...]',
              handle: '@adam_riha',
              imageSrc: '/static/images/people/3.jpeg',
              url: 'https://www.reddit.com/r/SaaS/comments/1gucxgx/comment/lxttiqv/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button',
            },

            {
              name: 'Martin B.',
              text: 'Very nice idea to pull the metadata from the websites and create standalone pages instead of just a table!',
              handle: '@martin_buur',
              imageSrc: '/static/images/people/20.png',
              url: 'https://www.reddit.com/r/SaaS/comments/1gucxgx/comment/lxw0vk5/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button',
            },

            {
              name: 'CranQ',
              text: 'A person of the people!',
              handle: '@CranQnow',
              imageSrc: '/static/images/people/17.jpg',
              url: 'https://x.com/CranQnow/status/1859549466879025423',
            },
          ]}
          withBackgroundGlow
        />
      </LandingTestimonialReadMoreWrapper>

      <LandingFaqCollapsibleSection
        title="Got Questions? We've Got Answers!"
        description="Find answers to common inquiries about our deal & discount platform:"
        faqItems={[
          {
            question: 'How do I submit a deal?',
            answer: (
              <>
                You can submit a deal by creating a pull request at{' '}
                <a
                  href="https://github.com/danmindru/rare-big-deal/pulls"
                  className="underline"
                >
                  github.com/danmindru/rare-big-deal/pulls
                </a>
                . All submissions are automatically accepted in order of
                submission.
              </>
            ),
          },
          {
            question: 'Where can I see the submitted deals?',
            answer: (
              <>
                All submitted deals are featured on our webpage at{' '}
                <a href="https://rarebigdeal.com" className="underline">
                  rarebigdeal.com
                </a>
                . The submissions will be categorized and displayed
                alphabetically and you'll get a standalone page for your deal.
              </>
            ),
          },
          {
            question: 'Are all deals accepted?',
            answer:
              'Yes, as long as you have a deal, it will be accepted and featured on our webpage.',
          },
          {
            question: 'Is the process automated?',
            answer:
              'Yes, everything is automated after submission. If you need any manual changes, please raise a pull request.',
          },
          {
            question: 'Can I make changes to my submitted deal?',
            answer:
              'Yes, you can make changes by raising a pull request with the necessary modifications.',
          },
          {
            question: 'How are deals ordered?',
            answer:
              'Deals are ordered based on the time of submission on the Github repo, with the latest submissions appearing at the bottom. On the webpage, they ordered b alphabetically and grouped by category.',
          },
          {
            question: 'Is there a limit to the number of deals I can submit?',
            answer:
              'No, there is no limit to the number of deals you can submit.',
          },
          {
            question: 'Do I need coding skills to submit a deal?',
            answer:
              'No, you do not need coding skills. Simply create a pull request with your deal details.',
          },
          {
            question:
              'How long does it take for my deal to appear on the webpage?',
            answer:
              'Deals are processed automatically and should appear on the webpage shortly after submission.',
          },
          {
            question: 'Can I feature my deal at the top of the list?',
            answer: (
              <>
                There is no option to do that currently. Get in touch with us at{' '}
                <a href={metadata.twitter} className="underline">
                  here
                </a>{' '}
                for more information.
              </>
            ),
          },
          {
            question:
              'What information do I need to include in my deal submission?',
            answer:
              'Please take a previous deal as an example and include all the necessary information in your submission. You need a name, short description and a deal text as a minimum.',
          },
          {
            question: 'Can I delete my submitted deal?',
            answer:
              'If you need to delete your submitted deal, please raise a pull request with the request for deletion.',
          },
        ]}
        withBackground
      />
    </div>
  );
}
