import { Box, Hidden, Link as MUILink } from "@mui/material";
import logoSrc from "../../../public/Balmoral_Brandmark-Logo_RGB_White-1.png";
import Image from "next/image";
import Link from "next/link";
import { styled } from "@mui/material/styles";

const LogoWrapper = styled(MUILink)(
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
    <Link href="/dashboard" passHref>
      <LogoWrapper>
        <Box sx={{ filter: "invert(1)" }}>
          <Image
            alt="Balmoral Digital Logo"
            src={logoSrc}
            width="50px"
            height="50px"
          />
        </Box>
      </LogoWrapper>
    </Link>
  );
}

export default Logo;
