import { Grid } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import { linkMentions } from './Util/Util';


const FarCasterPost = ({text, attachments} ) => {
    console.log({text}, "HELLO")
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
        <Grid item >
        <ReactMarkdown >
            {text} 
        </ReactMarkdown>

</Grid>
        )

}
export default FarCasterPost;
