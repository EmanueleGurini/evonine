const readline = require("readline");

import { AWSAccount } from "./AWSAccount";
import { Printer } from "./Printer";
import { menuOptions, awsRegionMap } from "./data";

export class Menu {
  private rl;
  private awsAccount: AWSAccount;

  constructor() {
    this.awsAccount = new AWSAccount();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * TODO: Add method description
   */
  public getMenuOptions() {
    return {
      "1": () => this.logAllStackNames(),
      "2": () => this.checkAllStacks(),
      "3": () => this.logAllDriftedStack(),
      "4": () => this.getAllStatusStack(),
      "5": () => this.printAllStackNamesOnTXTFile(),
      "6": () => this.printAllDriftedStackOnTXTFile(),
    };
  }

  /**
   * TODO: Add property description
   */
  public print(header: string, options: { [key: number]: string }) {
    console.log("");
    console.log(header);
    for (const key in options) {
      console.log(`${key}. ${options[key]}`);
    }
    console.log("Press x to exit");
    console.log("");
  }

  /**
   * TODO: Add method description
   */
  private printHeader() {
    console.log(`
    ███████████████████████████████████████████████████████████████

      ███████╗██╗   ██╗ ██████╗ ███╗   ██╗██╗███╗   ██╗███████╗
      ██╔════╝██║   ██║██╔═══██╗████╗  ██║██║████╗  ██║██╔════╝
      █████╗  ██║   ██║██║   ██║██╔██╗ ██║██║██╔██╗ ██║█████╗  
      ██╔══╝  ╚██╗ ██╔╝██║   ██║██║╚██╗██║██║██║╚██╗██║██╔══╝  
      ███████╗ ╚████╔╝ ╚██████╔╝██║ ╚████║██║██║ ╚████║███████╗
      ╚══════╝  ╚═══╝   ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝╚══════╝
                                                               
                       AWS Drift Detector

    ███████████████████████████████████████████████████████████████
      `);
  }

  /**
   * TODO: Add method description
   */
  private async selectRegion(): Promise<void> {
    this.print("Select your region:", awsRegionMap);
    const option = await this.getInput();

    const selectedRegion = awsRegionMap[option];
    if (selectedRegion) {
      this.awsAccount.setRegion(selectedRegion);
      console.log(
        "\x1b[42m",
        "Selected region:",
        this.awsAccount.getRegion(),
        "\x1b[0m"
      );
    } else {
      console.log("Invalid region. Please try again.");
    }
  }

  /**
   * TODO: Add method description
   */
  private async executeOption(option: string): Promise<void> {
    const options = this.getMenuOptions();
    const selectedOption = options[option];
    if (selectedOption) {
      console.log(
        "\x1b[45m",
        "Selected option:",
        menuOptions[option],
        "\x1b[0m"
      );
      await selectedOption();
    } else {
      console.log("Invalid option. Please try again.");
    }
  }

  /**
   * TODO: Add method description
   */
  public async start() {
    this.printHeader();

    let option: string;
    do {
      await this.selectRegion();

      do {
        this.print("Menu", menuOptions);
        option = await this.getInput();

        if (option !== "x") {
          await this.executeOption(option);
        }
      } while (option !== "x");
    } while (option !== "x");

    this.rl.close();
  }

  /**
   * TODO: Add method description
   */
  public getInput(): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question("Enter your option: ", (answer) => {
        resolve(answer.trim().toLowerCase());
      });
    });
  }

  /**
   * TODO: Add method description
   */
  public printAllStackNamesOnTXTFile() {
    try {
      console.log("Start..");
      console.log("Check for AWS Stack names..");

      this.awsAccount.getStackNamesFromStackList();
      const stackNames = this.awsAccount.getStackNameList();
      console.log(stackNames);
      const printer = new Printer(stackNames);
      printer.printData();
      console.log("Stack names saved on .txt file.");
      console.log("Check in your directory.");
    } catch (error) {
      console.error("Error during the execution:", error);
    }
  }

  /**
   * TODO: Add method description
   */
  public logAllStackNames() {
    try {
      console.log("Start..");
      console.log("Check for AWS Stack names..");

      const stackNames = this.awsAccount.getStackNameList();
      console.log("START =============================================");
      console.log(stackNames);
      console.log("=============================================== END");
    } catch (error: unknown) {
      console.error("Error during the execution:", error);
    }
  }

  /**
   * TODO: Add method description
   */
  public async checkAllStacks() {
    try {
      console.log("Start..");
      console.log("Check if all stack are in sync..");
      if (this.awsAccount.checkAllStacks()) {
        console.log("Stack are checked.");
      } else {
        this.awsAccount.checkAllStacks();
      }
    } catch (error: unknown) {
      console.error("Error during the execution:", error);
    }
  }

  /**
   * TODO: Add method description
   */
  public async logAllDriftedStack() {
    try {
      console.log("Start..");
      console.log("Check if all stack are in sync..");

      const stackNames = this.awsAccount.getAllDriftedStack();
      console.log("START =============================================");
      console.log(stackNames);
      console.log("=============================================== END");
    } catch (error: unknown) {
      console.error("Error during the execution:", error);
    }
  }

  /**
   * TODO: Add method description
   */
  public printAllDriftedStackOnTXTFile() {
    try {
      console.log("Start..");
      console.log("Check for AWS Stack names..");

      this.awsAccount.getStackNamesFromStackList();
      const stackNames = this.awsAccount.getAllDriftedStack();
      console.log(stackNames);
      const printer = new Printer(stackNames);
      printer.printData();
      console.log("Stack names saved on .txt file.");
      console.log("Check in your directory.");
    } catch (error: unknown) {
      console.error("Error during the execution:", error);
    }
  }

  public getAllStatusStack() {
    try {
      console.log("Start..");
      console.log("Check if all stack are in sync..");

      const stackNames = this.awsAccount.getAllStackWithStatus();
      console.log("START =============================================");
      console.log(stackNames);
      console.log("=============================================== END");
    } catch (error: unknown) {
      console.error("Error during the execution:", error);
    }
  }
}
