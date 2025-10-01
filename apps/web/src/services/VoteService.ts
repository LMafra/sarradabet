import { BaseService } from "../core/base/BaseService";
import { Vote, CreateVoteDto } from "../types/vote";
import { ApiResponse } from "../core/interfaces/IService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export class VoteService extends BaseService<Vote, CreateVoteDto, never> {
  constructor() {
    super(API_BASE_URL, "votes");
  }

  // Override update and delete methods since votes are immutable
  async update(): Promise<ApiResponse<Vote>> {
    throw new Error("Votes cannot be updated");
  }

  async delete(): Promise<ApiResponse<void>> {
    throw new Error("Votes cannot be deleted");
  }

  async getVotesByOddId(oddId: number): Promise<ApiResponse<Vote[]>> {
    const response = await this.getWithParams({ oddId });
    return response;
  }

  async getVotesByBetId(betId: number): Promise<ApiResponse<Vote[]>> {
    const response = await this.getWithParams({ betId });
    return response;
  }
}

// Export singleton instance
export const voteService = new VoteService();
