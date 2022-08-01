import React, {useState, useEffect} from 'react';
import { Grid } from '@mui/material';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import { fetchLinkPreviewData, getAllLinks, linkMentions } from './Util/Util';
import LinkPreview from '../LinkPreview/LinkPreview';
import { SeeMore } from '../Miscellaneous';
import { Web3Img } from './styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ReactPlayer from 'react-player';

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
    
const multipleAttachments = () => {
    return attachments.length>1 && attachments[0].images.length > 0
}
const imageListHeight = () => {
    if(attachments.length ===2){
        if(!attachments[0].images.length > 0){
        return 164
        }
    }
     return 450
}
//   const [linkPreviewData, setPreviewData] = useState(null);
//   const allLinks = getAllLinks(text)
//   console.log({allLinks, text, linkPreviewData})
//   useEffect(() => {
//     if ( allLinks && !attachments) {
//         (async () => {
//           try {
//             const web3Preview = await fetchLinkPreviewData(
//                 allLinks[0]
//             );
//             setPreviewData(web3Preview);
//           } catch (err) {
//             console.error(err);
//           }
//         })();
//     }
//   }, []);
    const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm     
    const matches = text.match(regexMdLinks)
    if(attachments){
        if(matches){
            matches?.forEach((element,i) => {
              text = reactStringReplace(text, element, () => {
                return attachments[i]?.images[0]
            }); 
            });
        }
        
    }
   console.log({attachments})
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
        {attachments?.length>0&&(
           <ImageList sx={{ width: 500, height:imageListHeight(), overflow: 'hidden' }} cols={multipleAttachments()?2:1} rowHeight={164}>
      {attachments.map((attachment, index)=>(
        <ImageListItem key={attachment.images[0]}>
            {attachment.images[0]?(  
            <Web3Img
                height={multipleAttachments()?164:450}
                src={attachment.images[0]}
                alt={attachment.images[0]}
              />):(
                <>
                {index===0&&(
                <ReactPlayer
                  controls
                  height={multipleAttachments()?164:450}
                  url={attachment.videos[0]}
                  width={'100%'}
                  style={{ borderRadius: 12, overflow: 'hidden' }}
                />)}
                </>
                )}
        
        </ImageListItem>
      ))}
    </ImageList>)}
         </>)}
        

        

</Grid>
        )

}
export default LensPost;
