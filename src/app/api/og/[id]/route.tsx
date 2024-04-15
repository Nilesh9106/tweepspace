import Tweep from '@/models/tweep';
import { dbConnect } from '@/utils/mongodb';
import { ImageResponse } from 'next/og';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';
import { parseTextWithoutHtml } from '@/utils/parseText';

// export const runtime = 'edge';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const tweep: any = await Tweep.findById(params.id).populate('author');
  if (!tweep) {
    return new Response('Tweep Not Found', { status: HttpStatusCode.NotFound });
  }
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 30,
          paddingTop: 40
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            width: '65%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={'https://tweepspace.vercel.app/tweeps.png'}
            width={130}
            height={130}
            style={{
              borderRadius: 10
            }}
          />
          <h1>Tweepspace</h1>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 30,
            borderRadius: 20,
            width: '65%',
            border: '1px solid #dedede',
            padding: 20
          }}
        >
          <img src={(tweep?.author as any).profile_picture} width={80} height={80} />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontSize: 20
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 'bold' }}>{tweep?.author.username}</div>
            <div style={{ lineClamp: 5 }}>{parseTextWithoutHtml(tweep?.content)}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1400,
      height: 700
    }
  );
};
