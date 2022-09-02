import Link from 'next/link';
import { StyledLink } from './styles';

function YupLink({ href, children, ...restProps }) {
  return (
    <Link href={href}>
      <StyledLink {...restProps}>{children}</StyledLink>
    </Link>
  );
}

export default YupLink;
