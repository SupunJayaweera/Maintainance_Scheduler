import { influxDB, org, bucket } from "../libs/influxdb.js";
import { Point } from "@influxdata/influxdb-client";

const queryApi = influxDB.getQueryApi(org);

export const getTaskStatusData = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const fluxQuery = `from(bucket: "${bucket}")
      |> range(start: -7d)
      |> filter(fn: (r) => r._measurement == "task_status" and r.workspaceId == "${workspaceId}")
      |> group(columns: ["_time", "status"], mode:"by")
      |> count(column: "_value")
      |> yield(name: "count")`;

    const data = [];
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        data.push({ time: o._time, status: o.status, count: o._value });
      },
      error(error) {
        console.error("InfluxDB query error:", error);
        res.status(500).json({ message: "Error querying InfluxDB" });
      },
      complete() {
        res.status(200).json(data);
      },
    });
  } catch (error) {
    console.error("Error in getTaskStatusData:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const writeTaskStatus = async (workspaceId, taskId, status) => {
  try {
    const writeApi = influxDB.getWriteApi(org, bucket);
    const point = new Point("task_status")
      .tag("workspaceId", workspaceId)
      .tag("taskId", taskId)
      .stringField("status", status)
      .timestamp(new Date());

    writeApi.writePoint(point);
    await writeApi.close();
    console.log("Task status written to InfluxDB");
  } catch (error) {
    console.error("Error writing task status to InfluxDB:", error);
  }
};