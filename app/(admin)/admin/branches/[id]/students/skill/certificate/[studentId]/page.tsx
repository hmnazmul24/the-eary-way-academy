"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import TypingTestResultBox from "./_components/TypingTestResultBox";
import DesignResultBox from "./_components/DesignResultBox";
import { useQuery } from "@tanstack/react-query";
import { getAdditionalCertificates } from "@/actions/studentsForAdmin/SkillCertificates";

type SkillType = "design" | "typing";
type SkillsType = { name: string; type: SkillType };

const skills: SkillsType[] = [
  { name: "Typing Skill", type: "typing" },
  {
    name: "Design Skill",
    type: "design",
  },
];

const SkillCertificateProviding = ({
  params,
}: {
  params: { studentId: string };
}) => {
  const { isPending, data, error } = useQuery({
    queryFn: async () => {
      let data = await getAdditionalCertificates({
        studentId: params.studentId,
      });
      return data;
    },
    queryKey: ["StudentSkillCertificateInfo"],
  });
  const [selectedType, setSelectedType] = useState<SkillType>("typing");

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error occurs! Please Refresh the page.</div>;
  }

  const { courseRange, design_certificate, genRoll, name, speed_certificate } =
    data.studentRecord!;
  return (
    <div className="">
      <h1 className="text-lg font-bold font-salsa mb-2 text-emerald-700">
        * Provide Skill Certificates
      </h1>
      <ul className="flex gap-2 flex-wrap p-2">
        {skills.map((item) => {
          return (
            <li
              onClick={() => setSelectedType(item.type)}
              key={item.name}
              className={cn(
                "p-2 px-3 font-bold transition-all active:scale-95 flex-none cursor-pointer rounded-md border shadow-md bg-white",
                selectedType === item.type
                  ? "ring-2 ring-blue-500 ring-offset-1 "
                  : ""
              )}
            >
              {item.name}
            </li>
          );
        })}
      </ul>

      <div className=" mt-4 max-w-lg">
        {selectedType === "typing" ? (
          <TypingTestResultBox
            name={name}
            roll={genRoll!}
            speed={speed_certificate?.speed}
            userId={speed_certificate?.userId}
            id={speed_certificate?.id}
            studentId={params.studentId}
          />
        ) : selectedType === "design" ? (
          <DesignResultBox
            name={name}
            roll={genRoll!}
            session={courseRange}
            studentId={params.studentId}
            userId={design_certificate?.userId}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SkillCertificateProviding;
