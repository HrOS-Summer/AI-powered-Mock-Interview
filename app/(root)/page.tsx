import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser, signOut } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const user = await getCurrentUser();
  if (!user || !user.id) redirect("/sign-in");

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id),
    await getLatestInterviews({ userId: user?.id })
  ]);

  const hasPassedInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

  return (
    <>
      <section className='card-cta'>
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Get Interview-Ready with AI-Powered practice & Feedback
          </h2>
          <p className="text-lg">
            Practice on real interview questions & get instant feedback
          </p>

          <div className="flex flex-row justify-between max-sm:flex-col max-sm:gap-4">
            <Button asChild className='btn-primary max-sm:w-full'>
              <Link href="/interview">Start an interview</Link>
            </Button>
            <Button className='btn-primary max-sm:w-full' onClick={signOut}>
              Log Out
            </Button>
          </div>
          
        </div>

        <Image src="/robot.png" alt='robot' height={400} width={400}
          className='max-sm:hidden'
        />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interview</h2>

        <div className="interviews-section">
          {
            hasPassedInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id}/>
              ))
            ) : (
              <p>You haven&apos;t generated any interviews yet. Click <span className='bg-dark-200 rounded-2xl px-3'>Start an interview
                </span> button above to generate an interview.</p> 
            
            )
          }  
        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>

        <div className="interviews-section">
        {
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id}/>
              ))
            ) : (
              <p>There are no new interviews available.</p> 
            )
          }
        </div>
      </section>
    </>
  )
}

export default page