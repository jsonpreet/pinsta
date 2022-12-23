import InterweaveContent from '@components/Common/InterweaveContent'
import IsVerified from '@components/Common/IsVerified'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Attribute } from '@utils/lens'
import { PublicationMainFocus } from '@utils/lens'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlinePlayCircle } from 'react-icons/ai'
import type { PinstaPublication } from '@utils/custom-types'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'

dayjs.extend(relativeTime)

// const CommentOptions = dynamic(() => import('./CommentOptions'))
// const PublicationReaction = dynamic(() => import('./PublicationReaction'))

interface Props {
  comment: PinstaPublication
}

// const VideoComment: FC<Props> = ({ comment }) => {
//   return (
//     <div className="my-2 py-3 px-4 border dark:border-gray-700 rounded-xl">
//       <Link
//         href={`/watch/${comment.id}`}
//         className="flex items-center space-x-2.5"
//       >
//         <AiOutlinePlayCircle className="w-5 h-5" />
//         <span>Watch Video</span>
//       </Link>
//     </div>
//   )
// }

const Comment: FC<Props> = ({ comment }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showReport, setShowReport] = useState(false)

  useEffect(() => {
    if (comment?.metadata?.content.trim().length > 200) {
      setClamped(true)
      setShowMore(true)
    }
  }, [comment?.metadata?.content])

  const getIsVideoComment = () => {
    return comment.metadata.mainContentFocus === PublicationMainFocus.Video
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start justify-between">
        <Link
          href={`/channel/${comment.profile?.handle}`}
          className="flex-none mr-3 mt-0.5"
        >
          <img
            src={getProfilePicture(comment.profile, 'avatar')}
            className="rounded-full w-7 h-7"
            draggable={false}
            alt={comment.profile?.handle}
          />
        </Link>
        <div className="flex flex-col items-start mr-2">
          <span className="flex items-center mb-1 space-x-1">
            <Link
              href={`/channel/${comment.profile?.handle}`}
              className="flex items-center space-x-1 text-sm font-medium"
            >
              <span>{comment?.profile?.handle}</span>
              <IsVerified id={comment?.profile.id} />
            </Link>
            <span className="inline-flex items-center opacity-70 space-x-1 text-[10px]">
              {dayjs(new Date(comment?.createdAt)).fromNow()}
            </span>
          </span>
          <div
            className={clsx(
              'text-sm opacity-80',
              clamped ? 'line-clamp-2' : ''
            )}
          >
            {comment?.hidden ? (
              <span className="text-xs italic opacity-80">
                Comment deleted by user!
              </span>
            ) : getIsVideoComment() ? (
              <Comment comment={comment} />
            ) : (
              <InterweaveContent content={comment?.metadata?.content} />
            )}
          </div>
          {showMore && (
            <div className="inline-flex mt-3">
              <button
                type="button"
                onClick={() => setClamped(!clamped)}
                className="flex items-center mt-2 text-xs outline-none hover:opacity-100 opacity-80"
              >
                {clamped ? (
                  <>
                    Show more <BiChevronDown className="h-3 ml-1 w-3" />
                  </>
                ) : (
                  <>
                    Show less <BiChevronUp className="h-3 w-3 ml-1" />
                  </>
                )}
              </button>
            </div>
          )}
          {!comment.hidden && (
            <div className="mt-2">
              {/* <PublicationReaction publication={comment} /> */}
            </div>
          )}
        </div>
      </div>
      <div>
        {/* <ReportModal
          video={comment}
          show={showReport}
          setShowReport={setShowReport}
        />
        <CommentOptions comment={comment} setShowReport={setShowReport} /> */}
      </div>
    </div>
  )
}

export default Comment