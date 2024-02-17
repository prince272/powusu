"use client";

import { Icon } from "@iconify/react";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import * as moment from "moment";

import "moment-duration-format";

import { Link as NextLink } from "@/providers/navigation";
import { cn, forwardPropsToChildren } from "@/utils";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Skeleton } from "@nextui-org/skeleton";

import { PostItem } from "@/types/post";
import { Mount, Switch } from "@/components/ui/render";

export interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  post?: PostItem | null | undefined;
  isEditable?: boolean;
}

const PostCard = ({ post, isEditable, className, ...props }: PostCardProps) => {
  return (
    <div className={cn("relative", className)} {...props}>
      <Card>
        <CardBody>
          <NextLink className="relative" href={`/portal/posts/${post?.id}`}>
            <Skeleton className="rounded-xl" isLoaded={!!post}>
              <Switch as="div" className="flex aspect-[4/3] items-center justify-center rounded-xl border border-default-200" switch={post?.imageUrl ? "image" : "blank"}>
                <Image key="image" alt={post?.title} className="aspect-[4/3] rounded-xl object-cover object-center" src={post?.imageUrl} />
                <Icon key="blank" className="text-default-200" icon="solar:gallery-bold" width="96" height="96" />
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
          <Skeleton className="rounded-xl" isLoaded={!!post}>
            <div className={cn("line-clamp-2 h-12", isEditable && "pr-8")}>
              <NextLink href={`/portal/posts/${post?.id}`}>
                <b>{post?.title}</b>
              </NextLink>
            </div>
          </Skeleton>
          <Skeleton className="rounded-xl" isLoaded={!!post}>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center justify-center space-x-1 text-xs">
                <div>
                  <Icon className="text-default-500" icon="solar:calendar-minimalistic-bold" width="20" height="20" />
                </div>
                <Mount interval={1000} clientOnly>
                  {() => <div>{moment.default(post?.createdAt).fromNow()}</div>}
                </Mount>
              </div>
              <div className="flex items-center justify-center space-x-1 text-xs">
                <div>
                  <Icon className="text-default-500" icon="solar:clock-circle-bold" width="20" height="20" />
                </div>
                <div>{moment.duration(Math.floor((post?.readingDuration || 0) / 10000)).format("w[w] d[d] h[h] m[m]", { trim: "both", largest: 1 })} read</div>
              </div>
            </div>
          </Skeleton>
          {isEditable && !!post && (
            <Dropdown>
              <DropdownTrigger>
                <Button className="absolute bottom-0 end-0 !mb-16 mr-1" isIconOnly variant="light" size="sm">
                  <Icon icon="solar:menu-dots-bold" width="20" height="20" className="rotate-90" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Post actions">
                <DropdownItem key="settings" startContent={<Icon icon="solar:pen-bold" width="20" height="20" />} as={NextLink} href={`/portal/posts/${post?.id}`}>
                  Edit
                </DropdownItem>
                <DropdownItem key="sign-out" startContent={<Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />} color="danger">
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
