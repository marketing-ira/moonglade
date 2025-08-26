import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import BrandsLogo from "../assets/images/brandslogo-hero.svg";
import Einfraa from "../assets/icons/einfraa.svg";
import IraWhite from "../assets/icons/Irawhite.svg";
const ContactCard = React.lazy(() => import("./common/ContactCard"));

interface FileNode {
  relativePath: string;
  publicURL: string;
}
interface HeroProps {
  setIsModalShow?: React.Dispatch<React.SetStateAction<boolean>>;
}
function Hero({ setIsModalShow }: HeroProps) {
  const data = useStaticQuery(graphql`
    query HeroImages {
      allFile(
        filter: {
          sourceInstanceName: { eq: "images" }
          relativePath: { in: ["moonglade-hero.png", "mobile-hero.png"] }
        }
      ) {
        nodes {
          relativePath
          publicURL
        }
      }
    }
  `);
  const moonGlade = data.allFile.nodes.find((node: FileNode) => {
    return node.relativePath === "moonglade-hero.png";
  });
  const moonGladeBackgroundImage = moonGlade?.publicURL
    ? `url(${moonGlade.publicURL})`
    : "none";

  const smallScreenImage = data.allFile.nodes.find((node: FileNode) => {
    return node.relativePath === "mobile-hero.png"; // using your existing mobile-hero image
  });
  const smallScreenBackgroundImage = smallScreenImage?.publicURL
    ? `url(${smallScreenImage.publicURL})`
    : moonGladeBackgroundImage;

  return (
    <section
      id="/"
      className="relative w-full h-screen opacity-100 sm:px-[120px] flex md:flex-row flex-col justify-start md:justify-between md:pb-12 pt-[165px] sm:pt-[76px] lg:pt-[220px] pb-6  md:items-start bg-hero-responsive mt-[64px]  sm:mt-[76px] lg:mt-[88px] text-center md:text-start"
      style={
        {
          "--mobile-bg-url": smallScreenBackgroundImage,
          "--desktop-bg-url": moonGladeBackgroundImage,
        } as React.CSSProperties & {
          "--mobile-bg-url": string;
          "--desktop-bg-url": string;
        }
      }
      aria-label="Hero Section"
    >
      <div className="flex flex-col font-bold text-[#1D256C]  leading-[53px] text-5xl md:text-6xl md:leading-[63px] tracking-normal">
        <span>Where</span>
        <span>your dreams</span>
        <span>take orbit</span>
      </div>

      <div className="flex flex-col gap-4 ">
        <h1 className="text-[#1D256C] 2xl md:text-4xl tracking-normal font-bold md:block hidden">
          Land on the moon
        </h1>
        <div >
          <button
            onClick={() => setIsModalShow?.(true)}
            className="border-[#1D256C] text-[#1D256C] border-2 rounded-full font-medium text-[14px] md:text-[28px] tracking-normal font-['Patra'] px-8 md:px-12  py-2 mt-4 md:mt-0"
          >
            Download Brochure
          </button>
        </div>
      </div>
       
      <div className="absolute bottom-9 left-4 right-4 md:left-11 md:right-11 flex justify-between items-center  hero-icons">
        <div className="w-24 md:w-32 lg:w-40 flex items-center">
          <Einfraa />
        </div>
        <div className="w-20 md:w-28 lg:w-36 flex items-center">
          <IraWhite />
        </div>
      </div>
    </section>
  );
}

export default Hero;
