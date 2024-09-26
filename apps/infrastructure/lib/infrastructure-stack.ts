import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Nextjs } from 'cdk-nextjs-standalone';
import path = require('path');
import { HostedZone, PublicHostedZone } from 'aws-cdk-lib/aws-route53';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const hostedZone = new PublicHostedZone(this, 'yosephZone', {
      zoneName: "yoseph.tech",
    });

    const value = new Nextjs(this, "web", {
      nextjsPath: path.join(__dirname, "../../web"),
      domainProps:  {
        domainName: "www.yoseph.tech",
        hostedZone,
      },
      overrides: {
        nextjsServer: {
          functionProps: {
            memorySize: 831,
          }
        }
      }
    });

    this.exportValue(value.distribution.distributionDomain, {
      name: "distro",
    })

    // The code that defines your stack goes here
  }
}
