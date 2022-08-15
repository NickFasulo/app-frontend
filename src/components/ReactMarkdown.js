import { Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { markdownReplaceHashtags, markdownReplaceLinks } from './CustomWeb3PostEmbed/Util/Util';
import Link from './Link';
import LinkPreview from './LinkPreview/LinkPreview';
import { TruncateText } from './styles';

const YupReactMarkdown = ({ props, children, lines, linkPreview, classes }) => {
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
      //    img: ({node, ...props}) => <img  height="100px" style={{maxHeight:'200px'}}{...props} />
      // }}
      components={{
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
              if(originalText.includes('hyperlinkyupreplace')){
                elem = <Typography  display="inline">
                <Link href={props.href} >
                  {originalText.replace("hyperlinkyupreplace", '')} 
                </Link>
                </Typography>
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
