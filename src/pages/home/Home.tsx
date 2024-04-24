import { PostList } from "@/components/PostList";
import { TimelineDivider } from "@/components/TimelineDivider";
import { RootState } from "@/lib/create-store";
import { useSelector } from "react-redux";
import { HomeViewModelType, selectHomeViewModel } from "./home.viewmodel";
import { ReactNode } from "react";

export const Home = () => {
  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectHomeViewModel>
  >((rootState) =>
    selectHomeViewModel(rootState, () => new Date().toISOString())
  );

  const timelineNode: ReactNode = () => {
    switch (viewModel.timeline.type) {
      case HomeViewModelType.NoTimeline:
        return null;
      case HomeViewModelType.EmptyTimeline:
        return null;
      case HomeViewModelType.WithMessages:
        return null;
      default:
        return exhaustiveGuard(viewModel.timeline);
    }
  };

  return (
    <>
      <TimelineDivider text="For you" />
    </>
  );
};
