import {
  Dropdown,
  DropdownTrigger,
  User,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button,
} from "@nextui-org/react";
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
  return (
    <main className="h-screen overflow-hidden flex bg-slate-300 dark:bg-slate-950">
      <aside className="bg-white dark:backdrop-blur-sm dark:bg-slate-900/30 h-full w-[17%] shadow-2xl border-r dark:border-slate-100/20"></aside>

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
