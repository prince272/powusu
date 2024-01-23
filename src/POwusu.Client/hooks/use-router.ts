import { useEffect } from "react";
import { useRouter as useBaseRouter, usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

export const useRouter = () => {
  const router = useBaseRouter();

  const { push } = router;

  router.push = (href, options) => {
    NProgress.start();
    push(href, options);
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return router;
};
