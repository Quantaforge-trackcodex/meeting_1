import { DockerService } from "./docker";

// Simple in-memory storage for active workspace ports
// In production, this should be in Redis or Database
const activeWorkspaces = new Map<string, number>();
const START_PORT = 3001;

export class WorkspaceManager {
  // Get an available port
  static async allocatePort(): Promise<number> {
    let port = START_PORT;
    while (Array.from(activeWorkspaces.values()).includes(port)) {
      port++;
    }
    return port;
  }

  // Start a workspace container and return the access URL
  static async startWorkspace(
    workspaceId: string,
  ): Promise<{ url: string; port: number }> {
    // Check if already running
    if (activeWorkspaces.has(workspaceId)) {
      const port = activeWorkspaces.get(workspaceId)!;
      return {
        url: `http://localhost:${port}`,
        port,
      };
    }

    const port = await this.allocatePort();

    try {
      await DockerService.createContainer(
        workspaceId,
        "gitpod/openvscode-server:latest",
        port,
      );
      activeWorkspaces.set(workspaceId, port);

      // Wait a brief moment for server to boot? (Optional, usually frontend handles retry)
      return {
        url: `http://localhost:${port}`,
        port,
      };
    } catch (error) {
      console.error(`Failed to start workspace ${workspaceId}:`, error);
      throw error;
    }
  }

  static async stopWorkspace(workspaceId: string) {
    // We'd need the container ID ideally, but assuming naming convention in DockerService
    const containerName = `trackcodex-${workspaceId}`;
    try {
      // This is a bit leaky relying on name, but fine for MVP
      const docker = (await import("./docker")).docker;
      const container = docker.getContainer(containerName);
      await container.stop();
    } catch (e) {
      // Ignore
    }
    activeWorkspaces.delete(workspaceId);
  }
}
