import { Suspense } from 'react';
import { Flex, Skeleton } from 'antd';

type SuspenseLoaderProps = {
  children: JSX.Element;
};

function SuspenseLoader({ children }: SuspenseLoaderProps): JSX.Element {
  return (
    <Suspense
      fallback={
        <Flex vertical className="w-full max-w-sm gap-6">
          <Skeleton.Input active className="!w-full !max-w-sm !h-32" />
          <Skeleton.Input active className="!w-full !max-w-sm !h-20" />
          <Skeleton.Input active className="!w-full !max-w-sm !h-20" />
          <Skeleton.Button active className="!w-full !max-w-sm" />
        </Flex>
      }
    >
      {children}
    </Suspense>
  );
}

export default SuspenseLoader;
