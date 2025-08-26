import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactCard = React.lazy(
  () => import("../components/common/ContactCard")
);

interface MainLayoutProps {
  children: React.ReactNode;
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  isModalShow: boolean;
}

function MainLayout({
  setIsModalShow,
  isModalShow,
  children,
}: MainLayoutProps) {
  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isModalShow) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [isModalShow]);
  return (
    <>
      <Navbar setIsModalShow={setIsModalShow} />
      <div className={isModalShow ? "pointer-events-none" : "pointer-events-auto"}>
        {children}
      </div>
      <Footer />


      {isModalShow && (
        <section
          onClick={() => setIsModalShow(false)}
          className="fixed inset-0 z-50 w-full h-full bg-black/20 backdrop-blur-md flex justify-center items-center sm:mt-8"
        >
          <React.Suspense fallback={<div>Loading...</div>}>
            <div onClick={(e) => e.stopPropagation()}>
              <ContactCard setIsModalShow={setIsModalShow} />
            </div>
          </React.Suspense>
        </section>
      )}
    </>
  );
}

export default MainLayout;
