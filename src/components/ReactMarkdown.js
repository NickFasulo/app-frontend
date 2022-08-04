import { Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import Link from './Link';

const YupReactMarkdown = ({ props, children }) => {
  return (
    <ReactMarkdown
      // components={{
      //    img: ({node, ...props}) => <img  height="100px" style={{maxHeight:'200px'}}{...props} />
      // }}
      components={{
         a: ({node, ...props}) => 
         (<Typography display="inline">
            <Link {...props} />
         </Typography>)
      }}
      
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
};
export default YupReactMarkdown;
