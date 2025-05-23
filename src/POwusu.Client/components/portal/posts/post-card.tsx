"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import * as moment from "moment";

import { Icon } from "@/components/ui/icon";

import "moment-duration-format";

import { useModalRouter } from "@/providers/modal-router";
import { cn, forwardPropsToChildren } from "@/utils";
import SolarCalendarMinimalisticBold from "@iconify/icons-solar/calendar-minimalistic-bold";
import SolarClockCircleBold from "@iconify/icons-solar/clock-circle-bold";
import SolarGalleryBold from "@iconify/icons-solar/gallery-bold";
import SolarMenuDotsBold from "@iconify/icons-solar/menu-dots-bold";
import SolarPenBold from "@iconify/icons-solar/pen-bold";
import SolarTrashBinTrashBold from "@iconify/icons-solar/trash-bin-trash-bold";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Skeleton } from "@heroui/skeleton";

import { PostItem } from "@/types/post";
import { Link as NextLink } from "@/components/ui/navigation";
import { Mount, Switch } from "@/components/ui/render";

import { DeletePostModal } from "./delete-post-modal";

export interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  post?: PostItem | null | undefined;
  isEditable?: boolean;
  isLoaded?: boolean;
}

const PostCard = ({ post, isEditable, isLoaded, className, ...props }: PostCardProps) => {
  const modalRouter = useModalRouter();

  return (
    <div className={cn("relative", className)} {...props}>
      <Card>
        <CardBody>
          <NextLink className="relative" href={`/portal/posts/${post?.id}`}>
            <Skeleton className="z-20 rounded-xl" isLoaded={isLoaded}>
              <Switch as="div" className="flex aspect-[4/3] items-center justify-center rounded-xl border border-default-200" switch={post?.imageUrl ? "image" : "blank"}>
                <Image key="image" alt={post?.title} className="aspect-[4/3] rounded-xl object-cover object-center" src={post?.imageUrl} />
                <Icon key="blank" className="text-default-200" icon={SolarGalleryBold} width="96" height="96" />
              </Switch>
            </Skeleton>
            <Chip
              className={cn("absolute bottom-0 z-10 mb-2 ml-2 text-xs dark", !post && "hidden")}
              variant="flat"
              avatar={<Avatar name={post?.author.fullName} src={post?.author.imageUrl!} />}
            >
              {post?.author.fullName}
            </Chip>
          </NextLink>
        </CardBody>
        <CardFooter className="flex-col items-stretch space-y-3 pt-0">
          <Skeleton className="z-20 rounded-xl" isLoaded={isLoaded}>
            <div className={cn("line-clamp-2 h-12", isEditable && "pr-8")}>
              <NextLink href={`/portal/posts/${post?.id}`}>
                <b>{post?.title}</b>
              </NextLink>
            </div>
          </Skeleton>
          <Skeleton className="z-20 rounded-xl" isLoaded={isLoaded}>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center justify-center space-x-1 text-xs">
                <div>
                  <Icon className="text-default-500" icon={SolarCalendarMinimalisticBold} width="24" height="24" />
                </div>
                <Mount interval={1000} clientOnly>
                  {() => <div>{moment.default(post?.createdAt).fromNow()}</div>}
                </Mount>
              </div>
              <div className="flex items-center justify-center space-x-1 text-xs">
                <div>
                  <Icon className="text-default-500" icon={SolarClockCircleBold} width="20" height="20" />
                </div>
                <div>{moment.duration(Math.floor((post?.readingDuration || 0) / 10000)).format("w[w] d[d] h[h] m[m]", { trim: "both", largest: 1 })} read</div>
              </div>
            </div>
          </Skeleton>
          {isEditable && !!post && isLoaded && (
            <Dropdown>
              <DropdownTrigger>
                <Button className="absolute bottom-0 end-0 z-30 !mb-16 mr-1" isIconOnly variant="light" size="sm">
                  <Icon icon={SolarMenuDotsBold} width="20" height="20" className="rotate-90" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Post actions">
                <DropdownItem key="settings" startContent={<Icon icon={SolarPenBold} width="20" height="20" />} as={NextLink} href={`/portal/posts/${post?.id}`}>
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="sign-out"
                  startContent={<Icon icon={SolarTrashBinTrashBold} width="20" height="20" />}
                  color="danger"
                  onPress={() => {
                    modalRouter.open({ key: "delete-post", Component: DeletePostModal, props: { post } });
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </CardFooter>
      </Card>
      {isEditable && post?.published && (
        <div className="absolute right-0 top-0 -mr-1 -mt-1 flex h-3 w-3">
          <div className="relative flex h-3 w-3">
            <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></div>
            <div className="relative inline-flex h-3 w-3 rounded-full bg-primary"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export { PostCard };
