import { Popover, Popper, Tooltip, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { markdownReplaceHashtags, markdownReplaceLinks } from './CustomWeb3PostEmbed/Util/Util';
import Link from './Link';
import LinkPreview from './LinkPreview/LinkPreview';
import { TruncateText } from './styles';

const YupReactMarkdown = ({ props, children, lines, linkPreview, classes }) => {
  const linkRef = useRef();
  console.log({linkRef}, window.pageYOffset )
  const [open, setOpen] = useState(false);


  const handlePopoverOpen = (event) => {
    setOpen(true)
    console.log( window.pageYOffset, linkRef.current.getBoundingClientRect().top, 'CALC')
  };

  const handlePopoverClose = () => {
    setOpen(false)
  };

  const parsed = markdownReplaceLinks(children);
 // const parsed2 = markdownReplaceHashtags(parsed);
  const getLinkPreview = (url) => {
    console.log({url})
    return linkPreview.find(x => x.url === url);
  }
  return (
    <TruncateText variant='body2' lines={lines} >
    <ReactMarkdown
      // components={{
      //    ul: ({node, ...props}) => <img  height="100px" style={{maxHeight:'200px'}}{...props} />
      // }}
      
      components={{
        ul: ({node, ...props}) => <ul   style={{listStylePosition: "inside",
          paddingLeft: 0}}{...props} />,
        ol: ({node, ...props}) => <ol   style={{listStylePosition: "inside",
        paddingLeft: 0}}{...props} />,
         a: ({node, ...props}) => 
         {
          const originalText = node?.children?.[0]?.value
          const [yupTag, text] = node?.children?.[0]?.value?.split("yupreplace")
          console.log(node?.children?.[0]?.value,{...props, yupTag, text})
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
                      classes={classes}
                      />)
                  } else {
                    elem = <Typography  display="inline">
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
                if(linkPreviewData){
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
                {linkRef?.current&&(
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
                else {
                  elem = <Typography  display="inline">
                <Link href={props.href.replace("hyperlinkyupreplace", '')} >
                  {originalText.replace("hyperlinkyupreplace", '')} 
                </Link>
                </Typography>
                }
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
