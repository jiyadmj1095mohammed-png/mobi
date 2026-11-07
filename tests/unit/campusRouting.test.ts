import { describe, it, expect } from "vitest";
import {
  BUILDINGS,
  FACILITIES,
  NODES,
  EDGES,
  computePath,
  findNearestNode,
} from "../../src/data/campusData";

describe("MOBI MAP - Campus Navigation Engine", () => {
  it("loads authoritative MEA Engineering College buildings", () => {
    expect(BUILDINGS.length).toBeGreaterThanOrEqual(10);
    const mainBlock = BUILDINGS.find((b) => b.id === "B-MAIN");
    expect(mainBlock).toBeDefined();
    expect(mainBlock?.name).toContain("MEA Engineering College");
    expect(mainBlock?.status).toBe("confirmed");

    const aud = BUILDINGS.find((b) => b.id === "B-AUD");
    expect(aud).toBeDefined();
    expect(aud?.status).toBe("confirmed");
  });

  it("registers facilities with explicit confirmed or proposed status", () => {
    expect(FACILITIES.length).toBeGreaterThanOrEqual(20);
    const busStop = FACILITIES.find((f) => f.id === "BUS-001");
    expect(busStop?.status).toBe("confirmed");

    const proposedBin = FACILITIES.find((f) => f.id === "BIN-005");
    expect(proposedBin?.status).toBe("proposed");
  });

  it("computes optimal walking route from Entrance (N01) to Auditorium (N13)", () => {
    const route = computePath("N01", "N13");
    expect(route).not.toBeNull();
    expect(route?.nodeIds[0]).toBe("N01");
    expect(route?.nodeIds[route.nodeIds.length - 1]).toBe("N13");
    expect(route?.lengthMeters).toBeGreaterThan(100);
    expect(route?.estMinutes).toBeGreaterThan(0);
  });

  it("flags route when it traverses an inferred unverified path connector", () => {
    // N17 is connected via an unverified connector to N16 / N12
    const route = computePath("N01", "N17");
    expect(route).not.toBeNull();
    expect(route?.hasInferredSegment).toBe(true);
  });

  it("accurately finds nearest graph node for a coordinate", () => {
    const node = findNearestNode([0, 0]);
    expect(node).toBeDefined();
    expect(NODES[node]).toBeDefined();
  });
});
