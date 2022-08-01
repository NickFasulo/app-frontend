import { Grid } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import { linkMentions } from './Util/Util';
import LinkPreview from '../LinkPreview/LinkPreview';

const FarCasterPost = ({text, attachments} ) => {
    // const regexMdLinks = /\B\@([\w\-]+)/gim
    // console.log(text, "WURST")
    // const matches = text.match(regexMdLinks)
    // matches?.forEach((element,i) => {
    //     text = reactStringReplace(text, element, (match) => {
    //         return (
    //             <>
    //             <TeaPartyLink href={`https://app.teaparty.life/u/${match}`}>
    //              {match}
    //             </TeaPartyLink>
    //             </>
    //   ); 
    //   });
    // });
    // reactStringReplace(text, /\B\@([\w\-]+)/gim, (match, i) => {
    //     return <TeaPartyLink >
    //     {match + 'replaced'}
    //     </TeaPartyLink>
    // })
  return (
    <>
      <Grid item>
        <ReactMarkdown>
          {text}
        </ReactMarkdown>
      </Grid>
      {attachments ? (attachments.map((attachment) => {
        return (
          <LinkPreview
            size={'large'}
            description={attachment.description || ''}
            image={attachment.images[0]}
            title={attachment.title}
            url={attachment.url}
          />
        )
      })) : null }
    </>
  )
}

export default FarCasterPost;
