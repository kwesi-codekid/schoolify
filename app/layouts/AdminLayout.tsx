import {
  Dropdown,
  DropdownTrigger,
  User,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { Link, useLocation } from "@remix-run/react";
import { GridBackground } from "~/components/ui/grid-background";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import { NotificationIcon } from "~/assets/icons/NotificationIcon";

const AdminLayout = ({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle: string;
}) => {
  const location = useLocation();
  const navbarLinks = [
    {
      label: "Dashboard",
      icon: "home",
      href: "/admin",
      children: [],
    },
    {
      label: "Classes",
      icon: "book",
      href: "/admin/classes",
      children: [],
    },
    {
      label: "Students",
      icon: "user",
      href: "/admin/students",
      children: [],
    },
    {
      label: "Teachers",
      icon: "user",
      href: "/admin/teachers",
      children: [],
    },
    {
      label: "Parents",
      icon: "user",
      href: "/admin/parents",
      children: [],
    },
    {
      label: "Subjects",
      icon: "book",
      href: "/admin/subjects",
      children: [],
    },
    {
      label: "Settings",
      icon: "settings",
      href: "/admin/settings",
      children: [
        {
          label: "Profile",
          icon: "user",
          href: "/admin/settings/profile",
        },
        {
          label: "Account",
          icon: "settings",
          href: "/admin/settings/account",
        },
      ],
    },
  ];
  return (
    <main className="h-screen overflow-hidden flex bg-slate-300 dark:bg-slate-950">
      <aside className="bg-white dark:backdrop-blur-sm dark:bg-slate-900/30 h-full w-[17%] shadow-2xl border-r dark:border-slate-100/20">
        {/* sidebar content */}
        <nav>
          <div className="flex flex-col gap-1">
            {navbarLinks.map((link, index) => {
              return (
                <>
                  {link.children.length > 0 ? (
                    <Accordion
                      motionProps={{
                        variants: {
                          enter: {
                            y: 0,
                            opacity: 1,
                            height: "auto",
                            transition: {
                              height: {
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                duration: 1,
                              },
                              opacity: {
                                easings: "ease",
                                duration: 1,
                              },
                            },
                          },
                          exit: {
                            y: -10,
                            opacity: 0,
                            height: 0,
                            transition: {
                              height: {
                                easings: "ease",
                                duration: 0.25,
                              },
                              opacity: {
                                easings: "ease",
                                duration: 0.3,
                              },
                            },
                          },
                        },
                      }}
                      key={index}
                      className="w-full"
                    >
                      <AccordionItem key={index} title={link.label}>
                        {link.children.map((child, index) => (
                          <Link
                            key={index}
                            to={child.href}
                            className="flex items-center gap-2 p-3 font-montserrat text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900/30"
                          >
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Link
                      key={index}
                      to={link.href}
                      className={`flex items-center gap-2 p-3 font-montserrat text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900/30 ${
                        location.pathname === link.href
                          ? " dark:bg-slate-950"
                          : ""
                      }`}
                    >
                      <span
                        className={` ${
                          location.pathname === link.href
                            ? "text-lightgreen"
                            : ""
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  )}
                </>
              );
            })}
          </div>
        </nav>
      </aside>

      <section className="h-full flex-1">
        {/* header */}
        <div className="bg-white dark:backdrop-blur-sm dark:bg-slate-900/30 py-2 flex items-center justify-between px-3 dark:border-slate-100/20 ">
          <h2 className="font-montserrat text-slate-800 dark:text-white text-2xl font-semibold">
            {pageTitle}
          </h2>

          <div className="flex items-center gap-5">
            {/* theme switcher */}
            <ThemeSwitcher btnSize="md" />

            {/* notification badge */}
            <Badge
              content="99+"
              shape="circle"
              color="danger"
              size="sm"
              classNames={{
                badge: "font-nunito text-[0.55rem]",
              }}
            >
              <Button
                radius="full"
                isIconOnly
                aria-label="more than 99 notifications"
                variant="faded"
              >
                <NotificationIcon size={24} />
              </Button>
            </Badge>

            {/* user avatar dropdown */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                    size: "sm",
                  }}
                  className="transition-transform"
                  description="Admin"
                  name="Tony Reichert"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">@tonyreichert</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* content */}
        <GridBackground>{children}</GridBackground>
      </section>
    </main>
  );
};

export default AdminLayout;
