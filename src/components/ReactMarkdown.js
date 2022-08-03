import ReactMarkdown from "react-markdown";


const YupReactMarkdown = ({props, children}) => {
    return (
        <ReactMarkdown  
        // components={{
        //    img: ({node, ...props}) => <img  height="100px" style={{maxHeight:'200px'}}{...props} />
        // }}
        {...props}>
            {children}
            </ReactMarkdown>
    )   
}
export default YupReactMarkdown;