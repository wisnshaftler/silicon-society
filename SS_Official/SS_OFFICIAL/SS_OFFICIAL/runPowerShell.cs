using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;
using System.Text;
using System.Threading.Tasks;
using System.Collections;

namespace SS_OFFICIAL
{
    class runPowerShell
    {
        public async Task<List<String>> runCommand (string command)
        {
            List<string> returnStringArray = new List<string>();
            try
            {
                using (PowerShell powerShell = PowerShell.Create())
                {
                    powerShell.AddScript(command);
                    
                    ICollection<PSObject> returnData = powerShell.Invoke();
                    foreach(PSObject output in returnData)
                    {
                        returnStringArray.Add(output.ToString());
                    }
                    return returnStringArray;
                }
            }
            catch (Exception ex)
            {
                return returnStringArray;
            }
        }
    }
}
