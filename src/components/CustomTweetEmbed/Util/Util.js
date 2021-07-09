import React from 'react'
import axios from 'axios'

const { BACKEND_API } = process.env

/**
 * - Removes https://t.co/ERYj5p9VHj that comes at end of text field in tweetData object if present
 * - Replaces '&amp;' with '&'
 * - Replaces '&nbsp;' with ' '
 *
 * @param {*} str text string to parse
 */
export const parseText = (str) => {
 const re = /http\S+/
 const parsed = str.replace(re, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
 return parsed
}

// Removes : and - after @tag (if someone types @myusername: it changes it to @myusername
export const parseTags = (str) => {
 const re = /[:-]/
 const parsed = str.replace(re, '')
 return parsed
}

// Converts http://www.example.com/page1/resource1 into --> example.com
export const linkMentions = (word) => {
     const re = /B@([w-]+)/gim
     const match = re.test(word)
     if (match) {
       word = parseTags(word)
       const userLink = `https://twitter.com/${word}`
       return (
         <>
           <a
             style={
              {
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500
              }
            }
             href={userLink}
             target='_blank'
           >{word}</a>
           <i> </i>
         </>
       )
     } else {
       return (
         <>{word} </>
       )
     }
   }

 export const fetchLinkPreviewData = async (passedURL) => {
   try {
     const res = await axios.get(`${BACKEND_API}/posts/linkpreview`, {
       params: {
         url: passedURL
       }
     })
     const { previewData } = res.data
     return previewData
   } catch (e) {
     console.log(e)
   }
 }
