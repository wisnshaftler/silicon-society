using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;

namespace SS_OFFICIAL
{
    class cmdRun
    {
        public static Process cmd = new Process();

        public async Task<String> getCMD(string command, int position)
        {
            try
            {
                cmd.StartInfo.FileName = "cmd";
                cmd.StartInfo.RedirectStandardInput = true;
                cmd.StartInfo.RedirectStandardOutput = true;
                cmd.StartInfo.CreateNoWindow = true;
                cmd.StartInfo.UseShellExecute = false;
                cmd.Start();
                cmd.StandardInput.WriteLine(command);
                cmd.StandardInput.Flush();
                cmd.StandardInput.Close();

                List<string> cmdOutput = new List<string>();
                String x;
                while ((x = await cmd.StandardOutput.ReadLineAsync()) != null)
                {
                    cmdOutput.Add(x);
                }

                cmd.WaitForExit();
                return cmdOutput[position];
            }catch(Exception ex)
            {
                return "1";
            }
        }
    }
}