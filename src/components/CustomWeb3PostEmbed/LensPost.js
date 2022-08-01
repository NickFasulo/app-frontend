import { Grid } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import { linkMentions } from './Util/Util';
import LinkPreview from '../LinkPreview/LinkPreview';
import { SeeMore } from '../Miscellaneous';
import { Web3Img } from './styles';

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

const LensPost = ({postid, text, url, attachments} ) => {
    const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm     
    const matches = text.match(regexMdLinks)
    if(attachments){
        if(matches){
            matches?.forEach((element,i) => {
              text = reactStringReplace(text, element, () => {
                return attachments[i]
            }); 
            });
        }
        
    }
   console.log(text)
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
        {matches? (<LinkPreview
        size={'large'}
        description={text[2]}
        image={text[1]}
        title={text[0]}
        url={url}
        />):(<><SeeMore maxLength={attachments? 150:400} postid={postid}>{text}</SeeMore>
        {attachments?.map(attachment=>{
            return (<Web3Img
                src={attachment}
                alt={attachment.title}
              />)
        })  }    </>)}
        

        

</Grid>
        )

}
export default LensPost;
