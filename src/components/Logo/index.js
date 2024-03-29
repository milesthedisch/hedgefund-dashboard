import { Box, Hidden } from "@mui/material";
import logoSrc from "../../../public/Balmoral_Brandmark-Logo_RGB_Black-150x150.png";
import Image from "next/image";
import { Link } from "next/link";
import { styled } from "@mui/material/styles";

const LogoWrapper = styled("a")(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        padding: ${theme.spacing(0, 1, 0, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
        display: flex;
        align-items: center;
`
);

const LogoTextWrapper = styled(Box)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        
`
);

const LogoText = styled(Box)(
  ({ theme }) => `
        font-size: ${theme.typography.pxToRem(15)};
        font-weight: ${theme.typography.fontWeightBold};
`
);

function Logo() {
  return (
    <LogoWrapper component={Link} href="/dashboard">
      <Image
        alt="Balmoral Digital Logo"
        src={logoSrc}
        width="50px"
        height="50px"
      />
      <Hidden mdDown>
        <LogoTextWrapper>
          <LogoText>Baloral Digital</LogoText>
        </LogoTextWrapper>
      </Hidden>
    </LogoWrapper>
  );
}

export default Logo;
