import Connect from "@/components/Connect";
import Voting from "@/components/Voting";
import FAQSection from "@/components/FAQSection";
import StakingInterface from "../components/oci"
export default function Home() {
  return (
    <>
      <Connect />
      <div className="bg-black text-white pt-20">
        {/* <StakingInterface/> */}
        {/* <StakingInterface/> */}
        <Voting />
      </div>
      <div className="bg-[#0c0c0c]">
        <FAQSection />
      </div>
    </>
  );
}
