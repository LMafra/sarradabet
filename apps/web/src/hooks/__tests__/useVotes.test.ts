import { renderHook, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import {
  useVotes,
  useVote,
  useVotesByOddId,
  useVotesByBetId,
  useCreateVote,
} from "../useVotes";
import { voteService } from "../../services/VoteService";
import { queryCache } from "../../core/hooks/useQueryCache";

// Mock the service
vi.mock("../../services/VoteService", () => ({
  voteService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getVotesByOddId: vi.fn(),
    getVotesByBetId: vi.fn(),
    create: vi.fn(),
  },
}));

const mockVoteService = voteService as unknown as {
  getAll: ReturnType<typeof vi.fn>;
  getById: ReturnType<typeof vi.fn>;
  getVotesByOddId: ReturnType<typeof vi.fn>;
  getVotesByBetId: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

describe("useVotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryCache.clear();
  });

  describe("useVotes", () => {
    it("should fetch all votes", async () => {
      const mockVotes = [
        { id: 1, oddId: 1, userId: "user1", amount: 100 },
        { id: 2, oddId: 2, userId: "user2", amount: 200 },
      ];

      mockVoteService.getAll.mockResolvedValue({
        success: true,
        data: mockVotes,
      });

      const { result } = renderHook(() => useVotes());

      await waitFor(() => {
        expect(result.current.data).toEqual(mockVotes);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });

      expect(mockVoteService.getAll).toHaveBeenCalledTimes(1);
    });

    it("should handle fetch error", async () => {
      const errorMessage = "Failed to fetch votes";
      mockVoteService.getAll.mockRejectedValue({
        message: errorMessage,
      });

      const { result } = renderHook(() => useVotes());

      await waitFor(() => {
        expect(result.current.data).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
      });
    });
  });

  describe("useVote", () => {
    it("should fetch a single vote", async () => {
      const mockVote = { id: 1, oddId: 1, userId: "user1", amount: 100 };
      mockVoteService.getById.mockResolvedValue({
        success: true,
        data: { vote: mockVote },
      });

      const { result } = renderHook(() => useVote(1));

      await waitFor(() => {
        expect(result.current.data).toEqual({ vote: mockVote });
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });

      expect(mockVoteService.getById).toHaveBeenCalledWith(1);
    });

    it("should not fetch when id is 0", () => {
      const { result } = renderHook(() => useVote(0));

      expect(mockVoteService.getById).not.toHaveBeenCalled();
      expect(result.current.data).toBe(null);
    });
  });

  describe("useVotesByOddId", () => {
    it("should fetch votes by odd ID", async () => {
      const mockVotes = [
        { id: 1, oddId: 1, userId: "user1", amount: 100 },
        { id: 2, oddId: 1, userId: "user2", amount: 200 },
      ];

      mockVoteService.getVotesByOddId.mockResolvedValue({
        success: true,
        data: mockVotes,
      });

      const { result } = renderHook(() => useVotesByOddId(1));

      await waitFor(() => {
        expect(result.current.data).toEqual(mockVotes);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });

      expect(mockVoteService.getVotesByOddId).toHaveBeenCalledWith(1);
    });

    it("should not fetch when oddId is 0", () => {
      const { result } = renderHook(() => useVotesByOddId(0));

      expect(mockVoteService.getVotesByOddId).not.toHaveBeenCalled();
      expect(result.current.data).toBe(null);
    });
  });

  describe("useVotesByBetId", () => {
    it("should fetch votes by bet ID", async () => {
      const mockVotes = [
        { id: 1, oddId: 1, userId: "user1", amount: 100 },
        { id: 2, oddId: 2, userId: "user2", amount: 200 },
      ];

      mockVoteService.getVotesByBetId.mockResolvedValue({
        success: true,
        data: mockVotes,
      });

      const { result } = renderHook(() => useVotesByBetId(1));

      await waitFor(() => {
        expect(result.current.data).toEqual(mockVotes);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });

      expect(mockVoteService.getVotesByBetId).toHaveBeenCalledWith(1);
    });

    it("should not fetch when betId is 0", () => {
      const { result } = renderHook(() => useVotesByBetId(0));

      expect(mockVoteService.getVotesByBetId).not.toHaveBeenCalled();
      expect(result.current.data).toBe(null);
    });
  });

  describe("useCreateVote", () => {
    it("should create a vote successfully", async () => {
      const mockVoteData = {
        oddId: 1,
        userId: "user1",
        amount: 100,
      };

      const mockCreatedVote = { id: 1, ...mockVoteData };
      mockVoteService.create.mockResolvedValue({
        success: true,
        data: { vote: mockCreatedVote },
      });

      const { result } = renderHook(() => useCreateVote());

      await act(async () => {
        const response = await result.current.mutateAsync(mockVoteData);
        expect(response).toEqual({ vote: mockCreatedVote });
      });

      await waitFor(() => {
        expect(result.current.data).toEqual({ vote: mockCreatedVote });
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockVoteService.create).toHaveBeenCalledWith(mockVoteData);
    });

    it("should handle creation error", async () => {
      const errorMessage = "Failed to create vote";
      const mockVoteData = {
        oddId: 1,
        userId: "user1",
        amount: 100,
      };

      mockVoteService.create.mockRejectedValue({
        message: errorMessage,
      });

      const { result } = renderHook(() => useCreateVote());

      await act(async () => {
        const response = await result.current.mutateAsync(mockVoteData);
        expect(response).toBe(null);
      });

      await waitFor(() => {
        expect(result.current.data).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.isError).toBe(true);
      });
    });

    it("should reset mutation state", () => {
      const { result } = renderHook(() => useCreateVote());

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isIdle).toBe(true);
    });
  });
});
