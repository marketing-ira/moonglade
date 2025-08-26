interface NavbarLinkType {
    label: string;
    url: string;
}


const NavLinks : NavbarLinkType[] = [
    {
        label: "Home",
        url: "/",
    },
    {
        label: "Our Projects",
        url: "#our-projects",
    },
    {
        label:"Clubhouse",
        url:"#clubhouse",
    },
    {
        label:"Amenities",
        url:"#amenities",
    },
    {
        label:"Plans",
        url:"#plans",
    },
]

export { NavLinks  };