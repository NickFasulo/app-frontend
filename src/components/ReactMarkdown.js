import ReactMarkdown from "react-markdown";


const YupReactMarkdown = ({props, children}) => {
    return (
        <ReactMarkdown {...props}>{children}</ReactMarkdown>
    )   
}
export default YupReactMarkdown;