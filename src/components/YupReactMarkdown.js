import { Popover, Popper, Tooltip, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { markdownReplaceHashtags, markdownReplaceLinks }  from '../utils/post_helpers';
import Link from './Link';
import LinkPreview from './LinkPreview/LinkPreview';
import { TruncateText } from './styles';

// const TeaPartyLink = styled('a')(
//   ({ theme }) => `
//     background-image: linear-gradient(270deg, #00E08E 0%, #A2CF7E 24.57%, #F0C909 50.35%, #FCA016 75.4%, #EB3650 100%)
//     font-weight: 700;
//     position: relative;
//     color: transparent;
//     -webkit-background-clip: text;
//     background-clip: text;
//     background-size: 300% 100%;
//     `
// );
const YupReactMarkdown = ({ props, children, lines, linkPreview, classes, post }) => {

  //Related to on hover LinkPreview
  // const linkRef = useRef();
  // const [open, setOpen] = useState(false);


  // const handlePopoverOpen = (event) => {
  //   setOpen(true)
  // };

  // const handlePopoverClose = () => {
  //   setOpen(false)
  // };
  const parsed = linkPreview?markdownReplaceLinks(children):children;
 // const parsed2 = markdownReplaceHashtags(parsed);
  const getLinkPreview = (url) => {
    return linkPreview.find(x => x?.url === url);
  }
  return (
    <TruncateText variant='body2' lines={lines} >
    <ReactMarkdown
      components={{
        ul: ({node, ...props}) => <ul   style={{listStylePosition: "inside",
          paddingLeft: 0}}{...props} />,
        ol: ({node, ...props}) => <ol   style={{listStylePosition: "inside",
        paddingLeft: 0}}{...props} />,
         a: ({node, ...props}) =>
         {
          const originalText = node?.children?.[0]?.value
          const [yupTag, text] = node?.children?.[0]?.value?.split("yupreplace")

          let elem =
          <Typography  display="inline">
              <Link {...props} />
            </Typography>

          switch (yupTag) {
            case 'hashtag':
             elem = <Typography  display="inline">
                      <Link href={props.href} >
                        {text}
                      </Link>
                  </Typography>
              break;

            case 'link': {
                  const linkPreviewData = getLinkPreview(text)
                  if(linkPreviewData){
                    ( elem=<LinkPreview
                      size={'large'}
                      image={linkPreviewData.img}
                      title={linkPreviewData.title}
                      url={linkPreviewData.url}
                      description={linkPreviewData.description}
                      // classes={classes}
                      />)
                  } else {
                    elem = <Typography  variant="body3" display="inline">
                    <Link href={props.href} >
                      {text}
                    </Link>
                    </Typography>
                  }
              }

              break;
            default: {
              if(props.href.includes('hyperlinkyupreplace')){
                const linkPreviewData = getLinkPreview(props.href.replace("hyperlinkyupreplace", ''))
                {/* Shows linkpreview on hover for hyperlinks */}
               {/* if(linkPreviewData){
                  elem =
                  <>
                  <Typography  display="inline"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                  ref={linkRef}>
                    <Link href={props.href.replace("hyperlinkyupreplace", '')} >

                      {originalText.replace("hyperlinkyupreplace", '')}
                    </Link>
                </Typography>

                 {linkRef?.current&&open&&(
                <Popover
                id="mouse-over-popover"
                sx={{
                  pointerEvents: 'none',
                }}
                open={open}
                  anchorReference="anchorPosition"
                  anchorPosition={{ top: linkRef.current.getBoundingClientRect().top, left: linkRef.current.getBoundingClientRect().left }}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                  PaperProps={{
                    sx:{
                      maxWidth: '500px',
                      background:"none",
                    }
                  }
                  }
                >

                    <LinkPreview
                    size={'large'}
                    image={linkPreviewData.img}
                    title={linkPreviewData.title}
                    url={linkPreviewData.url}
                    description={linkPreviewData.description}
                    classes={classes}
                    />
              </Popover>
              )}
              </>
                }
                else {*/}
                  elem = <Typography variant="body3" display="inline">
                <Link href={props.href.replace("hyperlinkyupreplace", '')} >
                  {originalText.replace("hyperlinkyupreplace", '')}
                </Link>
                </Typography>
                {/* } */}
              }
            }
              break;
          }
          return elem
        //  <Typography  display="inline">
        //     <Link {...props} />
        //  </Typography>

      }
      }}

      {...props}
    >
      {parsed}
    </ReactMarkdown>
    </TruncateText>
  );
};
export default YupReactMarkdown;
