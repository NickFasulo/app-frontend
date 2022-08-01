import { Grid } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import { linkMentions } from './Util/Util';

const TeaPartyLink = styled('a')(
    ({ theme }) => `
    background-image: linear-gradient(90deg,#12c2e9,#c471ed,#12c2e9,#f64f59,#c471ed,#ebed71);
    font-weight: 700;
    position: relative;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 300% 100%;
    `
  );

const TeaPartyPost = ({text, url, previews} ) => {
    const regexMdLinks = /\B\@([\w\-]+)/gim
    const matches = text.match(regexMdLinks)
    console.log({matches})
    matches?.forEach((element,i) => {
        text = reactStringReplace(text, element, (match) => {
            return (
                <>
                <Link href={`https://app.teaparty.life/u/${match.replace('@', '')}`}>
                <TeaPartyLink>
                 {match}
                </TeaPartyLink>
                </Link>
                </>
      ); 
      });
});
console.log(text, "WURST")
    // reactStringReplace(text, /\B\@([\w\-]+)/gim, (match, i) => {
    //     return <TeaPartyLink >
    //     {match + 'replaced'}
    //     </TeaPartyLink>
    // })
    return (
        <Grid item sx={{ "& *> a": { 
            backgroundImage: "linear-gradient(90deg,#12c2e9,#c471ed,#12c2e9,#f64f59,#c471ed,#ebed71)",
            fontWeight: 700,
            position: "relative",
            color: "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            backgroundSize: "300% 100%",
    }  }}>
        {text.map((element,i) => {
           return typeof element === 'string'?
                <ReactMarkdown key={i}>
                    {element} 
                </ReactMarkdown>
           : element            

        })}

</Grid>
        )

}
export default TeaPartyPost;
