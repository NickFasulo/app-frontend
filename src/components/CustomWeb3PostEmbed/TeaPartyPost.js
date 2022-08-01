import { Grid } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import { linkMentions } from './Util/Util';

const TeaPartyLink = styled(Link)(
    ({ theme }) => `
    backgroundImage: "linear-gradient(90deg,#12c2e9,#c471ed,#12c2e9,#f64f59,#c471ed,#ebed71)",
    fontWeight: 700,
    position: "relative",
    color: "transparent",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    backgroundSize: "300% 100%",
    `
  );

const TeaPartyPost = ({text, url, previews} ) => {
    const regexMdLinks = /\B\@([\w\-]+)/gim
    console.log(text, "WURST")
    const matches = text.match(regexMdLinks)
    matches?.forEach((element,i) => {
        text = reactStringReplace(text, element, (match) => {
            return (
                <>
                <TeaPartyLink href={`https://app.teaparty.life/u/${match}`}>
                 {match}
                </TeaPartyLink>
                </>
      ); 
      });
});
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
        <ReactMarkdown >
            {text} 
        </ReactMarkdown>

</Grid>
        )

}
export default TeaPartyPost;
