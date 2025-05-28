"use client";

import { Button } from "@/components/ui/button";
import { UniqueBranchCode } from "@/data/branch";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

const TestPage = () => {
  const { data, mutate } = useMutation({ mutationFn: UniqueBranchCode });

  return (
    <div>
      {data}
      <Button onClick={() => mutate()}> Click to change</Button>
    </div>
  );
};

export default TestPage;
